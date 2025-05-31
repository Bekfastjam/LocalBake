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

  // Create a new order
  app.post("/api/orders", async (req, res) => {
    try {
      const { order, items } = req.body;
      
      // Validate required fields
      if (!order || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Invalid order data" });
      }
      
      if (!order.customerName || !order.customerEmail || !order.businessId) {
        return res.status(400).json({ message: "Missing required customer information" });
      }
      
      if (items.length === 0) {
        return res.status(400).json({ message: "Order must contain at least one item" });
      }
      
      // Validate business exists
      const business = await storage.getBusiness(order.businessId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      const newOrder = await storage.createOrder(order, items);
      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get a specific order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Get orders by customer email
  app.get("/api/orders", async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Email parameter is required" });
      }
      
      const orders = await storage.getOrdersByEmail(email as string);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
