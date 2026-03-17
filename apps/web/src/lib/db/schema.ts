import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  numeric,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const waitlist = pgTable("waitlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  company: varchar("company", { length: 100 }),
  role: varchar("role", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deals = pgTable("deals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  assetType: varchar("asset_type", { length: 50 }).notNull(),
  address: text("address"),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  purchasePrice: numeric("purchase_price"),
  totalUnits: integer("total_units"),
  totalSqft: integer("total_sqft"),
  underwritingData: jsonb("underwriting_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  dealId: uuid("deal_id").references(() => deals.id).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  storagePath: text("storage_path").notNull(),
  documentType: varchar("document_type", { length: 50 }),
  parsedData: jsonb("parsed_data"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
