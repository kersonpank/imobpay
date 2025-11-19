import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  decimal, 
  integer,
  jsonb,
  pgEnum,
  index
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const userRoleEnum = pgEnum("user_role", ["landlord", "tenant", "fiador"]);
export const propertyStatusEnum = pgEnum("property_status", ["available", "rented", "maintenance"]);
export const contractStatusEnum = pgEnum("contract_status", ["draft", "generated", "signed", "active", "terminated", "renewal_pending"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "overdue", "canceled"]);
export const guaranteeTypeEnum = pgEnum("guarantee_type", ["fiador", "caucao", "seguro", "nenhuma"]);

// Users table (adapted for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  cpf: text("cpf").unique(),
  phone: text("phone"),
  role: userRoleEnum("role"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schema for upserting users (Replit Auth)
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;

// Schema for inserting users (manual registration)
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true 
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipcode: text("zipcode").notNull(),
  rentValue: decimal("rent_value", { precision: 10, scale: 2 }).notNull(),
  photos: jsonb("photos").$type<string[]>().default([]),
  status: propertyStatusEnum("status").default("available").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// Contracts table
export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  landlordId: varchar("landlord_id").notNull().references(() => users.id),
  tenantId: varchar("tenant_id").notNull().references(() => users.id),
  guarantorId: varchar("guarantor_id").references(() => users.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  dueDay: integer("due_day").notNull(),
  adjustmentIndex: text("adjustment_index").default("IPCA"),
  guaranteeType: guaranteeTypeEnum("guarantee_type").notNull(),
  guaranteeDetails: jsonb("guarantee_details"),
  contractText: text("contract_text"),
  contractPdfPath: text("contract_pdf_path"),
  signedContractPath: text("signed_contract_path"),
  status: contractStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContractSchema = createInsertSchema(contracts).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: varchar("contract_id").notNull().references(() => contracts.id),
  dueDate: timestamp("due_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  mercadoPagoPaymentId: text("mercado_pago_payment_id"),
  paymentLink: text("payment_link"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Documents table
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  contractId: varchar("contract_id").references(() => contracts.id),
  type: text("type").notNull(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ 
  id: true, 
  uploadedAt: true 
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Tenant Settings (for storing Mercado Pago credentials per landlord)
export const tenantSettings = pgTable("tenant_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  landlordId: varchar("landlord_id").notNull().unique().references(() => users.id),
  mercadoPagoPublicKey: text("mercado_pago_public_key"),
  mercadoPagoAccessToken: text("mercado_pago_access_token"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTenantSettingsSchema = createInsertSchema(tenantSettings).omit({ 
  id: true, 
  updatedAt: true 
});

export type InsertTenantSettings = z.infer<typeof insertTenantSettingsSchema>;
export type TenantSettings = typeof tenantSettings.$inferSelect;

// Onboarding data (temporary storage before contract creation)
export const onboardingData = pgTable("onboarding_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  tenantEmail: text("tenant_email").notNull(),
  tenantData: jsonb("tenant_data").notNull(),
  guaranteeType: guaranteeTypeEnum("guarantee_type").notNull(),
  guaranteeData: jsonb("guarantee_data"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOnboardingDataSchema = createInsertSchema(onboardingData).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertOnboardingData = z.infer<typeof insertOnboardingDataSchema>;
export type OnboardingData = typeof onboardingData.$inferSelect;
