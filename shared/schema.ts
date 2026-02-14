import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth"; // Import users from auth module

export * from "./models/auth";

// Products (Digital Assets)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sellerId: varchar("seller_id").notNull(), // References users.id (UUID)
  title: text("title").notNull(),
  description: text("description").notNull(),
  priceNear: text("price_near").notNull(), // Stored as string to avoid precision issues
  encryptedFileUrl: text("encrypted_file_url").notNull(), // URL to encrypted file
  previewUrl: text("preview_url"), // Public preview image/file
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });

// Transactions (Orders)
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  buyerId: varchar("buyer_id").notNull(), // References users.id (UUID)
  productId: integer("product_id").notNull(), // References products.id
  txHash: text("tx_hash").notNull(), // NEAR Transaction Hash
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  decryptionKey: text("decryption_key"), // Released after payment confirmation
  aiAnalysis: jsonb("ai_analysis"), // AI Agent's verification log
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true, decryptionKey: true, aiAnalysis: true });

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
