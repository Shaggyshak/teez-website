import type { DocumentParseRequest, DocumentParseResult } from "./types";

/**
 * Parse a CRE document (rent roll, T-12, OM) using Claude API.
 * This is the core extraction engine shared across Excel add-in, Sheets add-on, and web app.
 */
export async function parseDocument(
  request: DocumentParseRequest,
  apiKey: string
): Promise<DocumentParseResult> {
  // TODO: Implement Claude-based document parsing
  // Phase 1 implementation will:
  // 1. Convert PDF/CSV to text (using pdf-parse or similar)
  // 2. Send to Claude with structured extraction prompt
  // 3. Validate extracted data against expected schema
  // 4. Return typed result with confidence score
  throw new Error("Document parsing not yet implemented — Phase 1");
}

/**
 * Detect the type of CRE document from its content.
 */
export function detectDocumentType(
  text: string
): "rent-roll" | "t12" | "operating-memo" | "unknown" {
  const lower = text.toLowerCase();
  if (
    lower.includes("unit") &&
    (lower.includes("rent") || lower.includes("lease"))
  ) {
    return "rent-roll";
  }
  if (
    lower.includes("trailing") ||
    lower.includes("t-12") ||
    lower.includes("t12") ||
    (lower.includes("income") && lower.includes("expense"))
  ) {
    return "t12";
  }
  if (
    lower.includes("offering memorandum") ||
    lower.includes("investment summary")
  ) {
    return "operating-memo";
  }
  return "unknown";
}
