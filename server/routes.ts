import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // --- API Routes ---

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await storage.getProduct(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct({
        ...input,
        sellerId: (req.user as any).claims.sub
      });
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Transactions & AI Agent Logic
  app.post(api.transactions.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.transactions.create.input.parse(req.body);
      
      // Create initial transaction
      const transaction = await storage.createTransaction({
        ...input,
        buyerId: (req.user as any).claims.sub
      });

      // --- AI AGENT SIMULATION ---
      // In a real app, this would be a background job monitoring the NEAR blockchain.
      // Here, we simulate the AI analyzing the transaction hash and releasing the key.
      
      (async () => {
        // Simulate delay for "Blockchain Confirmation" and "AI Analysis"
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const mockDecryptionKey = `NOVA-KEY-${Math.random().toString(36).substring(7).toUpperCase()}`;
        const mockAiAnalysis = {
          checkedAt: new Date().toISOString(),
          riskScore: 0.05,
          verification: "PASSED",
          notes: "Transaction verified on NEAR testnet. Seller reputation confirmed."
        };

        await storage.updateTransactionStatus(
          transaction.id, 
          "completed", 
          mockDecryptionKey, 
          mockAiAnalysis
        );
      })();

      res.status(201).json(transaction);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.transactions.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const transactions = await storage.getTransactionsByBuyer((req.user as any).claims.sub);
    res.json(transactions);
  });

  app.get(api.transactions.get.path, async (req, res) => {
    if (!req.isAuthenticated()) {
       return res.status(401).json({ message: "Unauthorized" });
    }
    const id = parseInt(req.params.id);
    const transaction = await storage.getTransaction(id);
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    // Ensure only the buyer or seller (if implemented) can view
    if (transaction.buyerId !== (req.user as any).claims.sub) {
       return res.status(401).json({ message: "Unauthorized" });
    }

    res.json(transaction);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const mockSellerId = "mock-seller-id"; // In real auth, this would be a real user ID
    
    // We can't easily seed users with Replit Auth, but we can seed products with a placeholder ID
    // or wait for the first user. For demo purposes, we'll use a placeholder.
    
    await storage.createProduct({
      sellerId: mockSellerId,
      title: "Encrypted Source Code: AI Trading Bot",
      description: "Full Python source code for a high-frequency trading bot. Encrypted with NOVA.",
      priceNear: "50",
      encryptedFileUrl: "https://nova-vault.com/files/enc-12345",
      previewUrl: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=1000",
      isActive: true
    });
    
    await storage.createProduct({
      sellerId: mockSellerId,
      title: "Exclusive Digital Art: Neon Genesis",
      description: "4K Render. Only 1 copy available. Key released upon payment.",
      priceNear: "120",
      encryptedFileUrl: "https://nova-vault.com/files/enc-67890",
      previewUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000",
      isActive: true
    });

    await storage.createProduct({
      sellerId: mockSellerId,
      title: "E-Book: Mastering NEAR Protocol",
      description: "Comprehensive guide to building on NEAR. DRM-free but encrypted delivery.",
      priceNear: "10",
      encryptedFileUrl: "https://nova-vault.com/files/enc-54321",
      previewUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000",
      isActive: true
    });
  }
}
