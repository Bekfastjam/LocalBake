import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all businesses with optional filters
  app.get("/api/businesses", async (req, res) => {
    try {
      const { category, isOpen, hasVegan, query } = req.query;
      
      const filters = {
        category: category as string,
        isOpen: isOpen === 'true' ? true : isOpen === 'false' ? false : undefined,
        hasVegan: hasVegan === 'true',
        query: query as string
      };

      const businesses = await storage.getBusinesses(filters);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  // Get a specific business by ID
  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const business = await storage.getBusiness(id);
      
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      res.json(business);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business" });
    }
  });

  // Get menu items for a specific business
  app.get("/api/businesses/:id/menu", async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const menuItems = await storage.getMenuItemsByBusinessId(businessId);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Get reviews for a specific business
  app.get("/api/businesses/:id/reviews", async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByBusinessId(businessId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
