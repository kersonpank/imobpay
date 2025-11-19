import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, hashPassword, comparePassword, type AuthenticatedRequest } from "./auth";
import { registerUserSchema, loginUserSchema, updateUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({ message: "Email já cadastrado" });
      }

      const passwordHash = await hashPassword(validatedData.password);
      const user = await storage.createUserWithPassword(
        validatedData.email,
        passwordHash,
        validatedData.firstName,
        validatedData.lastName
      );

      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "Erro ao salvar sessão" });
        }
        res.json({ id: user.id, email: user.email, role: user.role });
      });
    } catch (error: any) {
      console.error("Error registering user:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error.code === '23505') {
        if (error.constraint === 'users_email_unique') {
          return res.status(409).json({ message: "Este email já está cadastrado" });
        }
        if (error.constraint === 'users_cpf_unique') {
          return res.status(409).json({ message: "Este CPF já está cadastrado" });
        }
        return res.status(409).json({ message: "Dados já cadastrados" });
      }
      res.status(500).json({ message: "Erro ao criar conta" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      const isValid = await comparePassword(validatedData.password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "Erro ao salvar sessão" });
        }
        res.json({ id: user.id, email: user.email, role: user.role });
      });
    } catch (error: any) {
      console.error("Error logging in:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Erro ao fazer login" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).json({ message: "Erro ao sair" });
      }
      res.json({ success: true });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthenticatedRequest).userId!;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User routes
  app.patch('/api/user', isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthenticatedRequest).userId!;
      const validatedData = updateUserSchema.parse(req.body);
      console.log("[PATCH /api/user] userId:", userId, "body:", validatedData);
      const updatedUser = await storage.updateUser(userId, validatedData);
      console.log("[PATCH /api/user] updatedUser:", updatedUser);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { passwordHash, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error.code === '23505') {
        if (error.constraint === 'users_cpf_unique') {
          return res.status(409).json({ message: "Este CPF já está cadastrado" });
        }
        if (error.constraint === 'users_email_unique') {
          return res.status(409).json({ message: "Este email já está cadastrado" });
        }
        return res.status(409).json({ message: "Dados já cadastrados" });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Properties routes
  app.get('/api/properties', isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthenticatedRequest).userId!;
      const properties = await storage.getPropertiesByOwner(userId);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/properties/:id', isAuthenticated, async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post('/api/properties', isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthenticatedRequest).userId!;
      const property = await storage.createProperty({
        ...req.body,
        ownerId: userId,
      });
      res.json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.patch('/api/properties/:id', isAuthenticated, async (req, res) => {
    try {
      const property = await storage.updateProperty(req.params.id, req.body);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete('/api/properties/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteProperty(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Contracts routes
  app.get('/api/contracts', isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthenticatedRequest).userId!;
      const user = await storage.getUser(userId);
      
      let contracts;
      if (user?.role === 'landlord') {
        contracts = await storage.getContractsByLandlord(userId);
      } else {
        contracts = await storage.getContractsByTenant(userId);
      }
      
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get('/api/contracts/:id', isAuthenticated, async (req, res) => {
    try {
      const contract = await storage.getContract(req.params.id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      console.error("Error fetching contract:", error);
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.post('/api/contracts', isAuthenticated, async (req, res) => {
    try {
      const contract = await storage.createContract(req.body);
      res.json(contract);
    } catch (error) {
      console.error("Error creating contract:", error);
      res.status(500).json({ message: "Failed to create contract" });
    }
  });

  app.patch('/api/contracts/:id', isAuthenticated, async (req, res) => {
    try {
      const contract = await storage.updateContract(req.params.id, req.body);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      console.error("Error updating contract:", error);
      res.status(500).json({ message: "Failed to update contract" });
    }
  });

  // Payments routes
  app.get('/api/payments/contract/:contractId', isAuthenticated, async (req, res) => {
    try {
      const payments = await storage.getPaymentsByContract(req.params.contractId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post('/api/payments', isAuthenticated, async (req, res) => {
    try {
      const payment = await storage.createPayment(req.body);
      res.json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  app.patch('/api/payments/:id', isAuthenticated, async (req, res) => {
    try {
      const payment = await storage.updatePayment(req.params.id, req.body);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({ message: "Failed to update payment" });
    }
  });

  // Tenant settings routes (Mercado Pago credentials)
  app.get('/api/settings', isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthenticatedRequest).userId!;
      const settings = await storage.getTenantSettings(userId);
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post('/api/settings', isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthenticatedRequest).userId!;
      const settings = await storage.upsertTenantSettings({
        landlordId: userId,
        ...req.body,
      });
      res.json(settings);
    } catch (error) {
      console.error("Error saving settings:", error);
      res.status(500).json({ message: "Failed to save settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
