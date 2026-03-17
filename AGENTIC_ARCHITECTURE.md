# Teez — Agentic Architecture Plan

## Context

Phase 0 is complete (monorepo, Next.js landing page, Supabase auth, waitlist, Excel add-in scaffold). The current Excel add-in has a rigid wizard flow (upload -> analyze -> results -> chat). We need to make it **agentic** — the user converses naturally and the AI autonomously decides what tools to invoke, reading/writing the spreadsheet, parsing documents, generating pro-formas, and fetching market data.

The core challenge is a **split-brain problem**: the LLM and heavy computation must run server-side (API keys, document parsing), but spreadsheet manipulation must run client-side (Office JS sandbox). The architecture must bridge this seamlessly.

---

## Architecture Overview

```
                    +----------------+
                    |   Claude API   |
                    |   (tool_use)   |
                    +-------+--------+
                            |
                    +-------v--------+
                    |     Agent      |
                    |  Orchestrator  |  packages/agent-core
                    |                |
                    | - Tool dispatch (server vs client)
                    | - Deal context cache
                    | - Conversation state
                    +---+--------+---+
                        |        |
             +----------v--+  +--v-----------+
             |Server Tools |  |Client Actions|
             |             |  | (via SSE)    |
             |- parseDoc   |  |              |
             |- proforma   |  |- read_cells  |
             |- sensitivity|  |- write_cells |
             |- marketData |  |- create_sheet|
             |- comps      |  |- format_range|
             +-------------+  +------+-------+
                                     |
                              +------v-------+
                              | Excel/Sheets |
                              | Task Pane    |
                              +--------------+
```

**Agent loop**: User message -> Claude API (with tools) -> Claude returns tool_use -> dispatch to server or client -> feed result back -> Claude continues -> repeat until text-only response.

---

## New Package: `packages/agent-core`

Platform-agnostic agent logic. No Office JS or Sheets dependencies.

```
packages/agent-core/src/
+-- index.ts
+-- orchestrator.ts            # Main agent loop (async generator)
+-- tools/
|   +-- registry.ts            # Tool definitions + dispatch
|   +-- spreadsheet.ts         # Client-side tool schemas (6 tools)
|   +-- document.ts            # Server-side: parse_document, detect_type
|   +-- financial.ts           # Server-side: proforma, sensitivity, metrics
|   +-- market-data.ts         # Server-side: Census/BLS/FRED, comps (stubs for now)
+-- context/
|   +-- deal-context.ts        # DealContext type + builder
|   +-- system-prompt.ts       # Assembles system prompt from context
|   +-- pruner.ts              # Token-aware conversation pruning
+-- protocol/
    +-- types.ts               # SSE event types
    +-- action-bridge.ts       # Server waits for client action results
    +-- session.ts             # Session state management
```

### The Orchestrator

```typescript
// Core function -- async generator that yields events
async function* runAgentTurn(
  config: OrchestratorConfig,
  input: TurnInput,
  executeClientAction: (tool: string, params: unknown) => Promise<unknown>,
  conversationHistory: Message[],
): AsyncGenerator<AgentEvent>
```

- Calls Claude with tool definitions + system prompt + deal context
- When Claude returns `tool_use`:
  - **Server tool** -> execute handler directly, yield `tool_result`
  - **Client tool** -> yield `action_request`, await `executeClientAction` callback
- Feed results back to Claude, loop (max 15 iterations)
- Yield streaming text, tool progress, and final `done` event

---

## Tools

### Client-side (Office JS, 6 tools)

| Tool | Purpose |
|---|---|
| `read_cells` | Read values from a cell range |
| `write_cells` | Write 2D array of values starting at a cell |
| `create_sheet` | Create a new worksheet |
| `format_range` | Apply number formats, colors, borders |
| `get_sheet_structure` | List all sheets, used ranges, headers |
| `read_named_range` | Read an Excel table or named range |

### Server-side (7 tools)

| Tool | Purpose | Wraps |
|---|---|---|
| `parse_document` | Extract rent roll/T-12/OM data from uploaded files | `@teez/ai-engine` parser (dedicated Claude call) |
| `detect_document_type` | Classify document without full parsing | `@teez/ai-engine` detectDocumentType |
| `generate_proforma` | Full DCF/IRR/equity multiple projection | `@teez/ai-engine` generateProForma |
| `run_sensitivity` | Sensitivity analysis on any assumption | `@teez/ai-engine` runSensitivity |
| `calculate_metric` | Quick one-off calc (cap rate, DSCR, GRM, etc.) | New handler |
| `fetch_market_data` | Demographics, employment, economic data | Census/BLS/FRED APIs |
| `search_comps` | Comparable sales near a location | Public records (stub, paid sources later) |

### Tool Definitions (Claude API format)

#### read_cells
```json
{
  "name": "read_cells",
  "description": "Read values from a range of cells in the active workbook. Returns a 2D array of cell values.",
  "input_schema": {
    "type": "object",
    "properties": {
      "sheet_name": { "type": "string", "description": "Worksheet name. Omit for active sheet." },
      "range": { "type": "string", "description": "Excel range notation, e.g. 'A1:D10', 'B:B'" }
    },
    "required": ["range"]
  }
}
```

#### write_cells
```json
{
  "name": "write_cells",
  "description": "Write values to a range of cells. The values array dimensions must match the target range.",
  "input_schema": {
    "type": "object",
    "properties": {
      "sheet_name": { "type": "string" },
      "start_cell": { "type": "string", "description": "Top-left cell, e.g. 'A1'" },
      "values": { "type": "array", "items": { "type": "array" }, "description": "2D array, row-major" }
    },
    "required": ["start_cell", "values"]
  }
}
```

#### create_sheet
```json
{
  "name": "create_sheet",
  "description": "Create a new worksheet in the active workbook.",
  "input_schema": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "activate": { "type": "boolean", "description": "Switch to the new sheet. Default true." }
    },
    "required": ["name"]
  }
}
```

#### format_range
```json
{
  "name": "format_range",
  "description": "Apply formatting to a cell range: number formats, font, colors, borders.",
  "input_schema": {
    "type": "object",
    "properties": {
      "range": { "type": "string" },
      "sheet_name": { "type": "string" },
      "format": {
        "type": "object",
        "properties": {
          "number_format": { "type": "string", "description": "e.g. '#,##0', '0.0%', '$#,##0'" },
          "bold": { "type": "boolean" },
          "font_color": { "type": "string" },
          "fill_color": { "type": "string" },
          "border": { "type": "string", "enum": ["thin", "medium", "thick", "none"] },
          "horizontal_alignment": { "type": "string", "enum": ["left", "center", "right"] }
        }
      }
    },
    "required": ["range", "format"]
  }
}
```

#### get_sheet_structure
```json
{
  "name": "get_sheet_structure",
  "description": "Get structure of the active workbook: sheet names, used ranges, and header rows.",
  "input_schema": { "type": "object", "properties": {} }
}
```

#### parse_document
```json
{
  "name": "parse_document",
  "description": "Parse a CRE document (rent roll, T-12, OM) and extract structured data.",
  "input_schema": {
    "type": "object",
    "properties": {
      "document_id": { "type": "string" },
      "asset_type": { "type": "string", "enum": ["multifamily", "industrial", "retail", "mixed-use", "office"] },
      "extraction_hint": { "type": "string", "description": "Optional hint, e.g. 'month-by-month T-12 for 2024'" }
    },
    "required": ["document_id"]
  }
}
```

#### generate_proforma
```json
{
  "name": "generate_proforma",
  "description": "Generate full pro-forma projection from rent roll, T-12, and assumptions. Returns year-by-year projections with IRR, equity multiple, cash-on-cash, and risk flags.",
  "input_schema": {
    "type": "object",
    "properties": {
      "rent_roll": { "type": "array" },
      "t12": { "type": "array" },
      "assumptions": { "type": "object", "description": "ProFormaAssumptions: purchasePrice, downPayment, interestRate, loanTermYears, amortizationYears, holdPeriodYears, rentGrowthRate, expenseGrowthRate, exitCapRate, vacancyRate, managementFeePercent, capexReservePerUnit" },
      "asset_type": { "type": "string" }
    },
    "required": ["rent_roll", "assumptions", "asset_type"]
  }
}
```

#### run_sensitivity
```json
{
  "name": "run_sensitivity",
  "description": "Run sensitivity analysis on a single assumption variable.",
  "input_schema": {
    "type": "object",
    "properties": {
      "base_request": { "type": "object", "description": "Base pro-forma request" },
      "variable": { "type": "string", "description": "e.g. 'vacancyRate', 'exitCapRate'" },
      "steps": { "type": "array", "items": { "type": "number" } }
    },
    "required": ["base_request", "variable", "steps"]
  }
}
```

#### calculate_metric
```json
{
  "name": "calculate_metric",
  "description": "Calculate a single financial metric from provided inputs.",
  "input_schema": {
    "type": "object",
    "properties": {
      "metric": { "type": "string", "enum": ["cap_rate", "dscr", "price_per_unit", "price_per_sqft", "grm", "break_even_occupancy", "loan_constant"] },
      "inputs": { "type": "object" }
    },
    "required": ["metric", "inputs"]
  }
}
```

#### fetch_market_data
```json
{
  "name": "fetch_market_data",
  "description": "Fetch market data for a location: demographics, employment, economic indicators.",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "e.g. 'Austin, TX'" },
      "data_types": { "type": "array", "items": { "type": "string", "enum": ["demographics", "employment", "income", "population_growth", "interest_rates", "cpi"] } }
    },
    "required": ["location", "data_types"]
  }
}
```

#### search_comps
```json
{
  "name": "search_comps",
  "description": "Search for comparable property sales near a location.",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "asset_type": { "type": "string" },
      "radius_miles": { "type": "number" },
      "min_units": { "type": "number" },
      "max_units": { "type": "number" },
      "sale_date_after": { "type": "string" }
    },
    "required": ["location", "asset_type"]
  }
}
```

---

## Client-Server Protocol: SSE + POST

SSE chosen over WebSocket because it works through enterprise proxies (critical for CRE firms), auto-reconnects, and is simpler with Next.js.

### Protocol Flow

```
Client                              Server
  |                                    |
  |-- POST /api/agent/message -------->|  "Analyze this rent roll"
  |                                    |
  |<-- SSE: text ----------------------|  "I'll analyze the rent roll..."
  |<-- SSE: tool_start ----------------|  { tool: "parse_document" }
  |<-- SSE: tool_result ---------------|  { result: extracted data }
  |<-- SSE: text ----------------------|  "Found 24 units. Writing..."
  |<-- SSE: action_request ------------|  { tool: "create_sheet", params: {...} }
  |                                    |
  |-- POST /api/agent/action-result -->|  { result: { created: true } }
  |                                    |
  |<-- SSE: action_request ------------|  { tool: "write_cells", params: {...} }
  |-- POST /api/agent/action-result -->|  { result: { cells_written: 192 } }
  |                                    |
  |<-- SSE: text ----------------------|  "Done! Pro-forma is in the sheet."
  |<-- SSE: done ----------------------|
```

### SSE Event Types

```typescript
type SSEEvent =
  | { event: "text"; data: { content: string } }
  | { event: "tool_start"; data: { id: string; tool: string } }
  | { event: "tool_result"; data: { id: string; result: unknown } }
  | { event: "action_request"; data: { id: string; tool: string; params: Record<string, unknown> } }
  | { event: "error"; data: { message: string; recoverable: boolean } }
  | { event: "done"; data: { deal_context_update?: Partial<DealContext> } }
```

### Action Bridge

Server "waits" for client actions via an in-memory `ActionBridge` (Map of pending promises resolved when client POSTs back). 30s timeout per action.

```typescript
class ActionBridge {
  private pending = new Map<string, { resolve, reject }>();

  async requestClientAction(actionId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.pending.set(actionId, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(actionId)) {
          this.pending.delete(actionId);
          reject(new Error(`Client action ${actionId} timed out`));
        }
      }, 30_000);
    });
  }

  resolveAction(actionId: string, result: unknown) {
    const entry = this.pending.get(actionId);
    if (entry) { this.pending.delete(actionId); entry.resolve(result); }
  }
}
```

For horizontal scaling (Phase 3+), swap to Redis pub/sub. The ActionBridge abstraction makes this transparent.

---

## Context Management

### Three layers:

1. **Conversation history** -- Claude messages array, pruned when approaching token limits (oldest messages summarized, keeping system prompt + last 4 turns)
2. **Deal context** -- Structured summary injected into system prompt. Stored in `deals.underwriting_data` JSONB. Avoids re-reading the entire spreadsheet each turn.
3. **Sheet context** -- Sheet names, used ranges, headers. Captured by `get_sheet_structure`, sent as metadata with each message.

### Deal Context Schema

```typescript
interface DealContext {
  deal_id: string;
  deal_name: string;
  asset_type: AssetType;
  address?: string;
  rent_roll_summary?: {
    total_units: number;
    occupied_units: number;
    avg_rent: number;
    total_monthly_income: number;
    unit_mix: Record<string, number>;
  };
  t12_summary?: {
    annual_noi: number;
    annual_egi: number;
    expense_ratio: number;
    months_covered: number;
  };
  assumptions?: ProFormaAssumptions;
  metrics?: {
    irr: number;
    equity_multiple: number;
    going_in_cap: number;
    avg_cash_on_cash: number;
  };
  sheet_map?: Record<string, string>; // e.g. { "rent_roll": "Rent Roll", "proforma": "Pro Forma" }
  parsed_documents?: string[];
}
```

### Token efficiency:
- Document parsing uses a **separate Claude call** (not the conversation context) -- cheaper model (Haiku) for extraction, conversation model (Sonnet) for reasoning
- Deal context uses summaries (~50 tokens) not full arrays (could be 5000+ tokens)
- Agent reads specific cell ranges on demand, not entire sheets

### System Prompt Structure (3 sections, assembled per-request):
1. **Role and rules** (static, ~300 tokens): CRE underwriting agent, tool capabilities, confirmation before destructive ops
2. **Deal context** (dynamic): Current deal state from DealContext
3. **Tool descriptions** (via Claude's tool definitions): JSON schemas

---

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/agent/session` | POST | Create new agent session |
| `/api/agent/message` | POST -> SSE | Send message, receive streaming events |
| `/api/agent/action-result` | POST | Client returns spreadsheet action result |
| `/api/agent/upload` | POST | Upload document (multipart) to Supabase Storage |
| `/api/agent/session/:id` | GET | Get session state (for reconnection) |

---

## Database Changes

Add to existing Drizzle schema (`apps/web/src/lib/db/schema.ts`):

```typescript
export const agentSessions = pgTable("agent_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  dealId: uuid("deal_id").references(() => deals.id),
  conversationHistory: jsonb("conversation_history").notNull().default([]),
  dealContext: jsonb("deal_context").notNull().default({}),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  totalTokensUsed: integer("total_tokens_used").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const toolExecutions = pgTable("tool_executions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").references(() => agentSessions.id).notNull(),
  toolName: varchar("tool_name", { length: 100 }).notNull(),
  executionLocation: varchar("execution_location", { length: 10 }).notNull(),
  params: jsonb("params"),
  result: jsonb("result"),
  error: text("error"),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## Excel Add-in Rewrite

Current wizard flow -> **chat-first agent UI**:

```
+-------------------------+
|  Teez AI  [Beta]   [=]  |
+-------------------------+
|  Deal: 123 Main St      |  <-- Deal context bar (collapsible)
|  24 units | MF | $3.2M  |
+-------------------------+
|                         |
|  Bot: What would you    |  <-- Chat thread
|  like to analyze today? |
|                         |
|  [file] rent_roll.pdf   |  <-- User upload card
|  "Analyze and build     |
|   5-year pro-forma"     |
|                         |
|  Bot: Parsing rent roll |  <-- Tool progress inline
|  [ok] Extracted 24 units|
|  [ok] Created "Pro Forma"|
|  IRR: 18.4% | EM: 2.1x |  <-- Inline metrics card
|  [!] 3 units below mkt  |
+-------------------------+
|  [clip] Type message... |  <-- Input bar with attachment button
+-------------------------+
```

### New client-side files:

```
apps/excel-addin/src/
+-- agent/
|   +-- agent-client.ts       # SSE connection + message sending
|   +-- action-executor.ts    # Routes action_requests -> Office JS
|   +-- sheet-context.ts      # Captures sheet structure
|   +-- session-manager.ts    # Session lifecycle
+-- excel/
|   +-- cell-operations.ts    # read_cells, write_cells via Excel.run()
|   +-- sheet-operations.ts   # create_sheet, get_sheet_structure
|   +-- format-operations.ts  # format_range
+-- components/
|   +-- TaskPane.tsx          # Rewrite: chat-first UI
|   +-- ChatThread.tsx        # Conversation thread with streaming
|   +-- MessageBubble.tsx     # User/agent/tool messages
|   +-- ToolProgress.tsx      # Active tool execution display
|   +-- DocumentUpload.tsx    # File upload with drag-drop
|   +-- DealSidebar.tsx       # Deal context summary
|   +-- QuickActions.tsx      # Common action suggestion buttons
+-- hooks/
    +-- useAgentChat.ts       # Chat state management
    +-- useSheetContext.ts    # Sheet structure hook
```

### Action Executor (core client-side logic)

```typescript
// apps/excel-addin/src/agent/action-executor.ts
const toolHandlers = {
  read_cells: async (params) => {
    return Excel.run(async (context) => {
      const sheet = params.sheet_name
        ? context.workbook.worksheets.getItem(params.sheet_name)
        : context.workbook.worksheets.getActiveWorksheet();
      const range = sheet.getRange(params.range);
      range.load("values");
      await context.sync();
      return { values: range.values, row_count: range.values.length, col_count: range.values[0]?.length ?? 0 };
    });
  },
  write_cells: async (params) => {
    return Excel.run(async (context) => {
      const sheet = params.sheet_name
        ? context.workbook.worksheets.getItem(params.sheet_name)
        : context.workbook.worksheets.getActiveWorksheet();
      const startCell = sheet.getRange(params.start_cell);
      const targetRange = startCell.getResizedRange(params.values.length - 1, params.values[0].length - 1);
      targetRange.values = params.values;
      await context.sync();
      return { cells_written: params.values.length * params.values[0].length };
    });
  },
  create_sheet: async (params) => {
    return Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.add(params.name);
      if (params.activate !== false) sheet.activate();
      await context.sync();
      return { sheet_name: params.name, created: true };
    });
  },
  // ... format_range, get_sheet_structure, read_named_range
};
```

---

## Google Sheets Portability

The agent-core package never touches Office JS. It emits `action_request` events. A `SpreadsheetAdapter` interface defines the contract:

```typescript
interface SpreadsheetAdapter {
  readCells(sheetName: string | undefined, range: string): Promise<CellReadResult>;
  writeCells(sheetName: string | undefined, startCell: string, values: CellValue[][]): Promise<CellWriteResult>;
  createSheet(name: string, activate?: boolean): Promise<SheetCreateResult>;
  formatRange(sheetName: string | undefined, range: string, format: CellFormat): Promise<void>;
  getSheetStructure(): Promise<SheetStructure>;
  readNamedRange(name: string): Promise<NamedRangeResult>;
}
```

Excel add-in implements `ExcelAdapter`. Future Google Sheets add-on implements `SheetsAdapter`. Same agent-core, different client.

---

## Dependency Graph

```
@teez/shared           (no deps -- types only)
    ^
@teez/ai-engine        (depends on: @teez/shared, @anthropic-ai/sdk)
    ^
@teez/agent-core       (depends on: @teez/shared, @teez/ai-engine, @anthropic-ai/sdk, zod)
    ^                       ^
@teez/web              @teez/excel-addin
(api routes)           (Office JS client -- communicates via HTTP only, does NOT import agent-core)
```

---

## Implementation Order

### Phase A: Agent core + protocol (~3 days)
1. Create `packages/agent-core` package with deps
2. Tool definitions (all 13 tools -- schemas only for client tools, handlers for server tools)
3. Orchestrator with async generator pattern
4. SSE event types + action bridge
5. System prompt assembly + deal context type

### Phase B: API endpoints (~2 days)
6. Add `agent_sessions` + `tool_executions` to DB schema
7. `POST /api/agent/session` -- create session
8. `POST /api/agent/message` -- SSE streaming endpoint (main agent entry point)
9. `POST /api/agent/action-result` -- resolve pending actions
10. `POST /api/agent/upload` -- file upload to Supabase Storage

### Phase C: Document parser (~3 days)
11. Implement `parse_document` in `@teez/ai-engine` -- Claude API structured extraction
12. PDF text extraction (pdf-parse)
13. Extraction prompts for rent rolls, T-12s, OMs
14. Validation + confidence scoring

### Phase D: Excel add-in client (~4 days)
15. Office JS operations (cell-operations, sheet-operations, format-operations)
16. Action executor (routes server action_requests -> Office JS)
17. Agent client (SSE stream reader + POST sender)
18. Chat-first UI rewrite (TaskPane, ChatThread, MessageBubble, ToolProgress, DocumentUpload)
19. useAgentChat + useSheetContext hooks

### Phase E: Integration + testing (~2 days)
20. End-to-end: upload PDF -> parse -> write to Excel -> generate pro-forma -> write results
21. Sensitivity analysis via chat ("What if vacancy is 10%?")
22. Session persistence + reconnection

---

## Verification Plan

1. **Unit**: Pro-forma generator produces correct IRR/equity multiple for known test deals
2. **Integration**: Upload a sample rent roll PDF -> agent parses, creates sheet, writes data, generates pro-forma, writes results -- all in one conversation turn
3. **Sensitivity**: Ask "What if vacancy is 10%?" -> agent runs sensitivity, updates cells
4. **Reconnection**: Close and reopen task pane -> session resumes with deal context intact
5. **Token efficiency**: 200-unit rent roll stays under 4K tokens in conversation context

---

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Protocol | SSE + POST (not WebSocket) | Works through enterprise proxies, auto-reconnects, simpler with Next.js |
| Agent loop location | Server-authoritative | API keys can't be in client JS; document parsing needs server infra |
| Orchestrator pattern | Async generator | Natural flow control, pauses on client actions, composes with SSE streaming |
| Document parsing | Separate Claude call (not in conversation) | Different prompt, can use cheaper model (Haiku), results are cached |
| Action bridge | In-memory Map (Phase 1) -> Redis (later) | Simple for single-process, swap transparent via ActionBridge class |
| Package structure | New `agent-core` package | Platform-agnostic; shared by Excel, Sheets, and web dashboard |
| UI paradigm | Chat-first (not wizard) | Agentic interaction; user describes intent, agent decides tools |
| Max loop iterations | 15 | Prevents runaway chains; enough for complex multi-step workflows |
| Client action timeout | 30 seconds | Generous for Office JS operations; surfaces errors instead of hanging |
