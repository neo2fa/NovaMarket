import { products, transactions, type Product, type InsertProduct, type Transaction, type InsertTransaction } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getProductsBySeller(sellerId: string): Promise<Product[]>;

  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByBuyer(buyerId: string): Promise<Transaction[]>;
  updateTransactionStatus(id: number, status: string, decryptionKey?: string, aiAnalysis?: any): Promise<Transaction>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.sellerId, sellerId));
  }

  // Transactions
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction;
  }

  async getTransactionsByBuyer(buyerId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.buyerId, buyerId)).orderBy(desc(transactions.createdAt));
  }

  async updateTransactionStatus(id: number, status: string, decryptionKey?: string, aiAnalysis?: any): Promise<Transaction> {
    const [updated] = await db.update(transactions)
      .set({ 
        status, 
        decryptionKey, 
        aiAnalysis 
      })
      .where(eq(transactions.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
