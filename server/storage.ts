import { db } from "../db";
import { 
  users, 
  properties, 
  contracts, 
  payments, 
  documents, 
  tenantSettings,
  onboardingData,
  type User,
  type InsertUser,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type Contract,
  type InsertContract,
  type Payment,
  type InsertPayment,
  type Document,
  type InsertDocument,
  type TenantSettings,
  type InsertTenantSettings,
  type OnboardingData,
  type InsertOnboardingData,
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;

  // Properties
  getProperty(id: string): Promise<Property | undefined>;
  getPropertiesByOwner(ownerId: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, data: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<void>;

  // Contracts
  getContract(id: string): Promise<Contract | undefined>;
  getContractsByLandlord(landlordId: string): Promise<Contract[]>;
  getContractsByTenant(tenantId: string): Promise<Contract[]>;
  getContractByProperty(propertyId: string): Promise<Contract | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: string, data: Partial<InsertContract>): Promise<Contract | undefined>;

  // Payments
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByContract(contractId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined>;

  // Documents
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByUser(userId: string): Promise<Document[]>;
  getDocumentsByContract(contractId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;

  // Tenant Settings
  getTenantSettings(landlordId: string): Promise<TenantSettings | undefined>;
  upsertTenantSettings(settings: InsertTenantSettings): Promise<TenantSettings>;

  // Onboarding
  getOnboardingData(id: string): Promise<OnboardingData | undefined>;
  getOnboardingDataByProperty(propertyId: string): Promise<OnboardingData[]>;
  createOnboardingData(data: InsertOnboardingData): Promise<OnboardingData>;
  updateOnboardingData(id: string, data: Partial<InsertOnboardingData>): Promise<OnboardingData | undefined>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Properties
  async getProperty(id: string): Promise<Property | undefined> {
    const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
    return result[0];
  }

  async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.ownerId, ownerId)).orderBy(desc(properties.createdAt));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const result = await db.insert(properties).values(property).returning();
    return result[0];
  }

  async updateProperty(id: string, data: Partial<InsertProperty>): Promise<Property | undefined> {
    const result = await db.update(properties).set(data).where(eq(properties.id, id)).returning();
    return result[0];
  }

  async deleteProperty(id: string): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  // Contracts
  async getContract(id: string): Promise<Contract | undefined> {
    const result = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);
    return result[0];
  }

  async getContractsByLandlord(landlordId: string): Promise<Contract[]> {
    return await db.select().from(contracts).where(eq(contracts.landlordId, landlordId)).orderBy(desc(contracts.createdAt));
  }

  async getContractsByTenant(tenantId: string): Promise<Contract[]> {
    return await db.select().from(contracts).where(eq(contracts.tenantId, tenantId)).orderBy(desc(contracts.createdAt));
  }

  async getContractByProperty(propertyId: string): Promise<Contract | undefined> {
    const result = await db.select().from(contracts)
      .where(and(
        eq(contracts.propertyId, propertyId),
        eq(contracts.status, "active")
      ))
      .limit(1);
    return result[0];
  }

  async createContract(contract: InsertContract): Promise<Contract> {
    const result = await db.insert(contracts).values(contract).returning();
    return result[0];
  }

  async updateContract(id: string, data: Partial<InsertContract>): Promise<Contract | undefined> {
    const result = await db.update(contracts).set(data).where(eq(contracts.id, id)).returning();
    return result[0];
  }

  // Payments
  async getPayment(id: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return result[0];
  }

  async getPaymentsByContract(contractId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.contractId, contractId)).orderBy(payments.dueDate);
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }

  async updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined> {
    const result = await db.update(payments).set(data).where(eq(payments.id, id)).returning();
    return result[0];
  }

  // Documents
  async getDocument(id: string): Promise<Document | undefined> {
    const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
    return result[0];
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.uploadedAt));
  }

  async getDocumentsByContract(contractId: string): Promise<Document[]> {
    const result = await db.select().from(documents).where(eq(documents.contractId, contractId)).orderBy(desc(documents.uploadedAt));
    return result.filter((doc: Document) => doc.contractId !== null);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const result = await db.insert(documents).values(document).returning();
    return result[0];
  }

  // Tenant Settings
  async getTenantSettings(landlordId: string): Promise<TenantSettings | undefined> {
    const result = await db.select().from(tenantSettings).where(eq(tenantSettings.landlordId, landlordId)).limit(1);
    return result[0];
  }

  async upsertTenantSettings(settings: InsertTenantSettings): Promise<TenantSettings> {
    const existing = await this.getTenantSettings(settings.landlordId);
    
    if (existing) {
      const result = await db.update(tenantSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(tenantSettings.landlordId, settings.landlordId))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(tenantSettings).values(settings).returning();
      return result[0];
    }
  }

  // Onboarding
  async getOnboardingData(id: string): Promise<OnboardingData | undefined> {
    const result = await db.select().from(onboardingData).where(eq(onboardingData.id, id)).limit(1);
    return result[0];
  }

  async getOnboardingDataByProperty(propertyId: string): Promise<OnboardingData[]> {
    return await db.select().from(onboardingData).where(eq(onboardingData.propertyId, propertyId)).orderBy(desc(onboardingData.createdAt));
  }

  async createOnboardingData(data: InsertOnboardingData): Promise<OnboardingData> {
    const result = await db.insert(onboardingData).values(data).returning();
    return result[0];
  }

  async updateOnboardingData(id: string, data: Partial<InsertOnboardingData>): Promise<OnboardingData | undefined> {
    const result = await db.update(onboardingData).set(data).where(eq(onboardingData.id, id)).returning();
    return result[0];
  }
}

export const storage = new DbStorage();
