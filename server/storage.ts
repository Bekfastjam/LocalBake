import { 
  businesses, 
  menuItems, 
  reviews, 
  type Business, 
  type InsertBusiness, 
  type MenuItem, 
  type InsertMenuItem, 
  type Review, 
  type InsertReview 
} from "@shared/schema";

export interface IStorage {
  // Business operations
  getBusinesses(filters?: {
    category?: string;
    isOpen?: boolean;
    hasVegan?: boolean;
    query?: string;
  }): Promise<Business[]>;
  getBusiness(id: number): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  
  // Menu operations
  getMenuItemsByBusinessId(businessId: number): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  
  // Review operations
  getReviewsByBusinessId(businessId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private businesses: Map<number, Business>;
  private menuItems: Map<number, MenuItem>;
  private reviews: Map<number, Review>;
  private currentBusinessId: number;
  private currentMenuItemId: number;
  private currentReviewId: number;

  constructor() {
    this.businesses = new Map();
    this.menuItems = new Map();
    this.reviews = new Map();
    this.currentBusinessId = 1;
    this.currentMenuItemId = 1;
    this.currentReviewId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample businesses
    const sampleBusinesses: InsertBusiness[] = [
      {
        name: "Sunshine Bakery",
        category: "bakery",
        description: "Family-owned bakery serving fresh artisan breads, pastries, and organic coffee since 1985. Known for our sourdough and seasonal fruit tarts.",
        address: "123 Main St, Downtown",
        phone: "(555) 123-4567",
        website: "sunbakery.com",
        imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.8",
        reviewCount: 156,
        isOpen: true,
        openUntil: "6:00 PM",
        distance: "0.3",
        tags: ["vegan", "organic", "wifi"],
        hours: {
          monday: "7:00 AM - 6:00 PM",
          tuesday: "7:00 AM - 6:00 PM",
          wednesday: "7:00 AM - 6:00 PM",
          thursday: "7:00 AM - 6:00 PM",
          friday: "7:00 AM - 7:00 PM",
          saturday: "8:00 AM - 7:00 PM",
          sunday: "8:00 AM - 5:00 PM"
        },
        location: { lat: 40.7128, lng: -74.0060 }
      },
      {
        name: "Brew & Bite Cafe",
        category: "cafe",
        description: "Modern coffee house specializing in single-origin brews and locally-sourced light bites.",
        address: "456 Oak Avenue, Midtown",
        phone: "(555) 234-5678",
        website: "brewbite.com",
        imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.6",
        reviewCount: 89,
        isOpen: true,
        openUntil: "8:00 PM",
        distance: "0.5",
        tags: ["wifi", "late-hours"],
        hours: {
          monday: "6:00 AM - 8:00 PM",
          tuesday: "6:00 AM - 8:00 PM",
          wednesday: "6:00 AM - 8:00 PM",
          thursday: "6:00 AM - 8:00 PM",
          friday: "6:00 AM - 9:00 PM",
          saturday: "7:00 AM - 9:00 PM",
          sunday: "7:00 AM - 7:00 PM"
        },
        location: { lat: 40.7589, lng: -73.9851 }
      },
      {
        name: "French Corner",
        category: "patisserie",
        description: "Authentic French patisserie offering handcrafted macarons, croissants, and classic pastries.",
        address: "789 Elm Street, Arts District",
        phone: "(555) 345-6789",
        website: "frenchcorner.com",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.9",
        reviewCount: 203,
        isOpen: false,
        openUntil: "Opens 7:00 AM",
        distance: "0.7",
        tags: ["gluten-free", "specialty"],
        hours: {
          monday: "7:00 AM - 6:00 PM",
          tuesday: "7:00 AM - 6:00 PM",
          wednesday: "7:00 AM - 6:00 PM",
          thursday: "7:00 AM - 6:00 PM",
          friday: "7:00 AM - 7:00 PM",
          saturday: "8:00 AM - 7:00 PM",
          sunday: "Closed"
        },
        location: { lat: 40.7505, lng: -73.9934 }
      },
      {
        name: "Daily Grind Coffee",
        category: "cafe",
        description: "Neighborhood coffee shop with locally roasted beans and homemade pastries.",
        address: "321 Pine Road, Tech Hub",
        phone: "(555) 456-7890",
        website: "dailygrind.com",
        imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        reviewCount: 67,
        isOpen: true,
        openUntil: "5:00 PM",
        distance: "1.2",
        tags: ["local", "work-friendly"],
        hours: {
          monday: "6:00 AM - 5:00 PM",
          tuesday: "6:00 AM - 5:00 PM",
          wednesday: "6:00 AM - 5:00 PM",
          thursday: "6:00 AM - 5:00 PM",
          friday: "6:00 AM - 6:00 PM",
          saturday: "7:00 AM - 6:00 PM",
          sunday: "8:00 AM - 4:00 PM"
        },
        location: { lat: 40.7419, lng: -73.9891 }
      },
      {
        name: "Sweet Spot Donuts",
        category: "bakery",
        description: "Artisan donut shop specializing in unique flavors and gourmet cold brew coffee.",
        address: "654 Birch Lane, Old Town",
        phone: "(555) 567-8901",
        website: "sweetspotdonuts.com",
        imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.7",
        reviewCount: 124,
        isOpen: true,
        openUntil: "3:00 PM",
        distance: "0.9",
        tags: ["fresh", "unique"],
        hours: {
          monday: "6:00 AM - 3:00 PM",
          tuesday: "6:00 AM - 3:00 PM",
          wednesday: "6:00 AM - 3:00 PM",
          thursday: "6:00 AM - 3:00 PM",
          friday: "6:00 AM - 4:00 PM",
          saturday: "7:00 AM - 4:00 PM",
          sunday: "7:00 AM - 2:00 PM"
        },
        location: { lat: 40.7282, lng: -74.0776 }
      },
      {
        name: "Artisan Bread Co",
        category: "bakery",
        description: "Traditional bakery focusing on sourdough and artisan breads using heritage grains.",
        address: "987 Cedar Avenue, Historic Quarter",
        phone: "(555) 678-9012",
        website: "artisanbread.com",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        reviewCount: 92,
        isOpen: true,
        openUntil: "4:00 PM",
        distance: "1.1",
        tags: ["organic", "artisan"],
        hours: {
          monday: "7:00 AM - 4:00 PM",
          tuesday: "7:00 AM - 4:00 PM",
          wednesday: "7:00 AM - 4:00 PM",
          thursday: "7:00 AM - 4:00 PM",
          friday: "7:00 AM - 5:00 PM",
          saturday: "8:00 AM - 5:00 PM",
          sunday: "8:00 AM - 3:00 PM"
        },
        location: { lat: 40.7645, lng: -73.9654 }
      }
    ];

    // Create businesses
    sampleBusinesses.forEach(business => {
      this.createBusiness(business);
    });

    // Sample menu items
    const sampleMenuItems: InsertMenuItem[] = [
      // Sunshine Bakery menu items
      { businessId: 1, category: "pastries", name: "Chocolate Croissant", description: "Buttery pastry with dark chocolate", price: "3.50" },
      { businessId: 1, category: "pastries", name: "Almond Danish", description: "Sweet almond cream filling", price: "4.25" },
      { businessId: 1, category: "pastries", name: "Blueberry Muffin", description: "Fresh local blueberries", price: "2.75" },
      { businessId: 1, category: "pastries", name: "Cinnamon Roll", description: "House-made with cream cheese glaze", price: "3.75" },
      { businessId: 1, category: "breads", name: "Sourdough Loaf", description: "Traditional San Francisco style", price: "6.50" },
      { businessId: 1, category: "breads", name: "Whole Wheat", description: "Organic whole grain", price: "7.25" },
      { businessId: 1, category: "breads", name: "Focaccia", description: "Rosemary and olive oil", price: "5.75" },
      { businessId: 1, category: "breads", name: "Baguette", description: "Classic French style", price: "4.50" },
      { businessId: 1, category: "beverages", name: "Espresso", description: "Single or double shot", price: "2.50" },
      { businessId: 1, category: "beverages", name: "Cappuccino", description: "With steamed milk foam", price: "4.25" },
      { businessId: 1, category: "beverages", name: "Cold Brew", description: "Smooth and refreshing", price: "3.75" },
      { businessId: 1, category: "beverages", name: "Chai Latte", description: "Spiced tea with steamed milk", price: "4.50" },

      // Brew & Bite Cafe menu items
      { businessId: 2, category: "beverages", name: "Single Origin Pour Over", description: "Rotating seasonal selection", price: "5.00" },
      { businessId: 2, category: "beverages", name: "Nitro Cold Brew", description: "Creamy nitrogen-infused", price: "4.50" },
      { businessId: 2, category: "light-bites", name: "Avocado Toast", description: "Multigrain bread, lime, chili flakes", price: "8.50" },
      { businessId: 2, category: "light-bites", name: "Breakfast Sandwich", description: "Egg, cheese, bacon on brioche", price: "9.25" },

      // French Corner menu items
      { businessId: 3, category: "pastries", name: "Classic Macarons", description: "Assorted flavors (6 pack)", price: "12.00" },
      { businessId: 3, category: "pastries", name: "Pain au Chocolat", description: "Traditional French pastry", price: "3.25" },
      { businessId: 3, category: "pastries", name: "Eclair", description: "Choux pastry with vanilla cream", price: "4.75" },
      { businessId: 3, category: "pastries", name: "Tarte Tatin", description: "Upside-down apple tart", price: "5.50" }
    ];

    sampleMenuItems.forEach(item => {
      this.createMenuItem(item);
    });

    // Sample reviews
    const sampleReviews: InsertReview[] = [
      {
        businessId: 1,
        authorName: "Sarah Johnson",
        rating: 5,
        comment: "Amazing sourdough bread! The crust is perfectly crispy and the inside is so soft and flavorful. Their chocolate croissants are to die for. Will definitely be back!"
      },
      {
        businessId: 1,
        authorName: "Mike Chen",
        rating: 4,
        comment: "Great local bakery with friendly staff. The coffee is excellent and pairs perfectly with their pastries. Only minor complaint is that they sometimes run out of popular items by afternoon."
      },
      {
        businessId: 1,
        authorName: "Emily Rodriguez",
        rating: 5,
        comment: "Love this place! As someone with dietary restrictions, I appreciate that they clearly label all their vegan and gluten-free options. The almond Danish is incredible!"
      },
      {
        businessId: 2,
        authorName: "David Kim",
        rating: 4,
        comment: "Perfect spot for remote work. Great WiFi, comfortable seating, and excellent coffee. The avocado toast is fresh and delicious."
      },
      {
        businessId: 3,
        authorName: "Marie Dubois",
        rating: 5,
        comment: "Authentic French pastries that remind me of Paris! The macarons are perfection - crispy shell, chewy interior, and amazing flavors."
      }
    ];

    sampleReviews.forEach(review => {
      this.createReview(review);
    });
  }

  async getBusinesses(filters?: {
    category?: string;
    isOpen?: boolean;
    hasVegan?: boolean;
    query?: string;
  }): Promise<Business[]> {
    let results = Array.from(this.businesses.values());

    if (filters?.category && filters.category !== 'all') {
      results = results.filter(business => business.category === filters.category);
    }

    if (filters?.isOpen !== undefined) {
      results = results.filter(business => business.isOpen === filters.isOpen);
    }

    if (filters?.hasVegan) {
      results = results.filter(business => business.tags.includes('vegan'));
    }

    if (filters?.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(business => 
        business.name.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query) ||
        business.category.toLowerCase().includes(query) ||
        business.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return results.sort((a, b) => parseFloat(a.distance || "0") - parseFloat(b.distance || "0"));
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = this.currentBusinessId++;
    const business: Business = { ...insertBusiness, id };
    this.businesses.set(id, business);
    return business;
  }

  async getMenuItemsByBusinessId(businessId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.businessId === businessId);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const menuItem: MenuItem = { ...insertMenuItem, id };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async getReviewsByBusinessId(businessId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.businessId === businessId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }
}

export const storage = new MemStorage();
