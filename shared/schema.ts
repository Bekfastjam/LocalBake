import { pgTable, text, serial, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // "bakery", "cafe", "patisserie", etc.
  description: text("description").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  website: text("website"),
  imageUrl: text("image_url").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  reviewCount: serial("review_count").notNull(),
  isOpen: boolean("is_open").notNull().default(false),
  openUntil: text("open_until"),
  distance: decimal("distance", { precision: 3, scale: 1 }), // in miles
  tags: text("tags").array().notNull().default([]), // ["vegan", "wifi", "organic", etc.]
  hours: jsonb("hours").notNull(), // {"monday": "7:00 AM - 6:00 PM", etc.}
  location: jsonb("location").notNull(), // {"lat": 40.7128, "lng": -74.0060}
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  businessId: serial("business_id").notNull(),
  category: text("category").notNull(), // "pastries", "breads", "beverages", etc.
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 5, scale: 2 }).notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  businessId: serial("business_id").notNull(),
  authorName: text("author_name").notNull(),
  rating: serial("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
