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
    // Seattle bakeries from Yelp data
    const sampleBusinesses: InsertBusiness[] = [
      {
        name: "Bakery Nouveau",
        category: "bakery",
        description: "There are so many choices from sweet to savory, freshly baked bread to delicious sandwiches.",
        address: "Capitol Hill, Seattle, WA",
        phone: "(206) 324-5711",
        website: "bakerynouveau.com",
        imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        reviewCount: 1400,
        isOpen: true,
        openUntil: "5:00 PM",
        distance: "0.4",
        tags: ["pastries", "sandwiches", "fresh"],
        hours: {
          monday: "7:00 AM - 5:00 PM",
          tuesday: "7:00 AM - 5:00 PM",
          wednesday: "7:00 AM - 5:00 PM",
          thursday: "7:00 AM - 5:00 PM",
          friday: "7:00 AM - 5:00 PM",
          saturday: "7:00 AM - 5:00 PM",
          sunday: "7:00 AM - 5:00 PM"
        },
        location: { lat: 47.6062, lng: -122.3321 }
      },
      {
        name: "Le Panier",
        category: "bakery",
        description: "French bakery with freshly baked goods that are not overly sweet but quite delicious.",
        address: "Downtown Seattle, WA",
        phone: "(206) 441-3669",
        website: "lepanier.com",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        reviewCount: 3000,
        isOpen: true,
        openUntil: "6:00 PM",
        distance: "0.3",
        tags: ["french", "pastries", "fresh"],
        hours: {
          monday: "7:00 AM - 6:00 PM",
          tuesday: "7:00 AM - 6:00 PM",
          wednesday: "7:00 AM - 6:00 PM",
          thursday: "7:00 AM - 6:00 PM",
          friday: "7:00 AM - 6:00 PM",
          saturday: "7:00 AM - 6:00 PM",
          sunday: "7:00 AM - 6:00 PM"
        },
        location: { lat: 47.6097, lng: -122.3331 }
      },
      {
        name: "Fuji Bakery",
        category: "bakery",
        description: "Cute little bakery with freshly baked goods displayed along their windows in Chinatown.",
        address: "Chinatown, Seattle, WA",
        phone: "(206) 624-5411",
        website: "fujibakery.com",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.3",
        reviewCount: 564,
        isOpen: true,
        openUntil: "5:00 PM",
        distance: "0.6",
        tags: ["japanese", "coffee", "pastries"],
        hours: {
          monday: "7:00 AM - 5:00 PM",
          tuesday: "7:00 AM - 5:00 PM",
          wednesday: "7:00 AM - 5:00 PM",
          thursday: "7:00 AM - 5:00 PM",
          friday: "7:00 AM - 5:00 PM",
          saturday: "7:00 AM - 5:00 PM",
          sunday: "7:00 AM - 5:00 PM"
        },
        location: { lat: 47.5979, lng: -122.3237 }
      },
      {
        name: "Piroshky Piroshky",
        category: "bakery",
        description: "The sweet scent of freshly baked bread draws you in to this popular Russian bakery.",
        address: "Downtown Seattle, WA",
        phone: "(206) 441-6068",
        website: "piroshky.com",
        imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.3",
        reviewCount: 7900,
        isOpen: true,
        openUntil: "7:00 PM",
        distance: "0.2",
        tags: ["russian", "bread", "specialty"],
        hours: {
          monday: "7:00 AM - 7:00 PM",
          tuesday: "7:00 AM - 7:00 PM",
          wednesday: "7:00 AM - 7:00 PM",
          thursday: "7:00 AM - 7:00 PM",
          friday: "7:00 AM - 7:00 PM",
          saturday: "7:00 AM - 7:00 PM",
          sunday: "7:00 AM - 7:00 PM"
        },
        location: { lat: 47.6089, lng: -122.3403 }
      },
      {
        name: "Sea Wolf Bakers",
        category: "bakery",
        description: "Perfect place to enjoy a warm cup of coffee and freshly baked bread in Fremont.",
        address: "Fremont, Seattle, WA",
        phone: "(206) 632-0369",
        website: "seawolfbakers.com",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        reviewCount: 399,
        isOpen: true,
        openUntil: "6:00 PM",
        distance: "1.2",
        tags: ["coffee", "bread", "neighborhood"],
        hours: {
          monday: "7:00 AM - 6:00 PM",
          tuesday: "7:00 AM - 6:00 PM",
          wednesday: "7:00 AM - 6:00 PM",
          thursday: "7:00 AM - 6:00 PM",
          friday: "7:00 AM - 6:00 PM",
          saturday: "7:00 AM - 6:00 PM",
          sunday: "7:00 AM - 6:00 PM"
        },
        location: { lat: 47.6517, lng: -122.3489 }
      },
      {
        name: "Saint Bread",
        category: "bakery",
        description: "Perfect location for a fun selection of delicious pastries in the University District.",
        address: "University District, Seattle, WA",
        phone: "(206) 632-3847",
        website: "saintbread.com",
        imageUrl: "https://images.unsplash.com/photo-1549030760-4c3dbb713d8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.2",
        reviewCount: 290,
        isOpen: true,
        openUntil: "6:00 PM",
        distance: "1.8",
        tags: ["pastries", "university", "fresh"],
        hours: {
          monday: "7:00 AM - 6:00 PM",
          tuesday: "7:00 AM - 6:00 PM",
          wednesday: "7:00 AM - 6:00 PM",
          thursday: "7:00 AM - 6:00 PM",
          friday: "7:00 AM - 6:00 PM",
          saturday: "7:00 AM - 6:00 PM",
          sunday: "7:00 AM - 6:00 PM"
        },
        location: { lat: 47.6587, lng: -122.3128 }
      },
      {
        name: "Petit Pierre Bakery",
        category: "patisserie",
        description: "Wonderful French bakery with delightful and delicious pastries both sweet and savory.",
        address: "Phinney Ridge, Seattle, WA",
        phone: "(206) 783-0451",
        website: "petitpierrebakery.com",
        imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        reviewCount: 432,
        isOpen: true,
        openUntil: "4:00 PM",
        distance: "2.1",
        tags: ["french", "coffee", "cafe"],
        hours: {
          monday: "7:00 AM - 4:00 PM",
          tuesday: "7:00 AM - 4:00 PM",
          wednesday: "7:00 AM - 4:00 PM",
          thursday: "7:00 AM - 4:00 PM",
          friday: "7:00 AM - 4:00 PM",
          saturday: "7:00 AM - 4:00 PM",
          sunday: "7:00 AM - 4:00 PM"
        },
        location: { lat: 47.6722, lng: -122.3505 }
      },
      {
        name: "La Parisienne French Bakery",
        category: "patisserie",
        description: "Everything is freshly baked and delicious. The staff is nice and friendly.",
        address: "Belltown, Seattle, WA",
        phone: "(206) 448-4032",
        website: "laparisienneseattle.com",
        imageUrl: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.3",
        reviewCount: 757,
        isOpen: true,
        openUntil: "5:00 PM",
        distance: "0.5",
        tags: ["french", "cafe", "macarons"],
        hours: {
          monday: "7:00 AM - 5:00 PM",
          tuesday: "7:00 AM - 5:00 PM",
          wednesday: "7:00 AM - 5:00 PM",
          thursday: "7:00 AM - 5:00 PM",
          friday: "7:00 AM - 5:00 PM",
          saturday: "7:00 AM - 5:00 PM",
          sunday: "7:00 AM - 5:00 PM"
        },
        location: { lat: 47.6154, lng: -122.3414 }
      }
    ];

    // Create businesses
    sampleBusinesses.forEach(business => {
      this.createBusiness(business);
    });

    // Seattle bakery menu items
    const sampleMenuItems: InsertMenuItem[] = [
      // Bakery Nouveau menu items
      { businessId: 1, category: "pastries", name: "Chocolate Croissant", description: "Flaky pastry with dark chocolate", price: "3.75" },
      { businessId: 1, category: "pastries", name: "Almond Croissant", description: "Sweet almond cream filling", price: "4.25" },
      { businessId: 1, category: "sandwiches", name: "Italian Roll", description: "Salami and provolone on fresh roll", price: "8.50" },
      { businessId: 1, category: "pastries", name: "Raspberry Spring Cake", description: "Seasonal fresh raspberry cake", price: "5.50" },
      { businessId: 1, category: "breads", name: "Artisan Baguette", description: "Fresh baked daily", price: "4.50" },
      { businessId: 1, category: "pastries", name: "Tiramisu Cake", description: "Classic Italian dessert", price: "6.25" },
      { businessId: 1, category: "beverages", name: "Vanilla Latte", description: "Espresso with steamed milk and vanilla", price: "4.75" },

      // Le Panier menu items
      { businessId: 2, category: "pastries", name: "Pain au Chocolat", description: "Traditional French chocolate pastry", price: "3.50" },
      { businessId: 2, category: "pastries", name: "Croissant", description: "Classic buttery French croissant", price: "2.75" },
      { businessId: 2, category: "pastries", name: "Chouquette", description: "Light choux pastry with pearl sugar", price: "1.50" },
      { businessId: 2, category: "breads", name: "French Baguette", description: "Traditional crusty baguette", price: "4.00" },

      // Fuji Bakery menu items
      { businessId: 3, category: "pastries", name: "Melon Pan", description: "Sweet Japanese melon-flavored bread", price: "3.25" },
      { businessId: 3, category: "pastries", name: "An Pan", description: "Soft bread with sweet red bean filling", price: "2.95" },
      { businessId: 3, category: "pastries", name: "Curry Bread", description: "Fried bread with Japanese curry", price: "3.75" },
      { businessId: 3, category: "beverages", name: "Green Tea Latte", description: "Matcha with steamed milk", price: "4.25" },

      // Piroshky Piroshky menu items
      { businessId: 4, category: "pastries", name: "Beef Piroshky", description: "Traditional Russian pastry with beef", price: "5.50" },
      { businessId: 4, category: "pastries", name: "Potato & Cheese Piroshky", description: "Savory pastry with potato and cheese", price: "4.75" },
      { businessId: 4, category: "pastries", name: "Apple Cinnamon Piroshky", description: "Sweet pastry with apple and cinnamon", price: "4.25" },
      { businessId: 4, category: "breads", name: "Black Bread", description: "Traditional Russian dark bread", price: "5.25" },

      // Sea Wolf Bakers menu items
      { businessId: 5, category: "breads", name: "Sourdough Loaf", description: "Classic San Francisco style sourdough", price: "6.50" },
      { businessId: 5, category: "breads", name: "Multigrain Bread", description: "Hearty bread with seeds and grains", price: "7.25" },
      { businessId: 5, category: "pastries", name: "Morning Bun", description: "Cinnamon sugar pastry", price: "3.50" },
      { businessId: 5, category: "beverages", name: "Drip Coffee", description: "Fresh roasted daily", price: "2.75" },

      // Saint Bread menu items
      { businessId: 6, category: "pastries", name: "Cinnamon Roll", description: "House-made with cream cheese glaze", price: "4.25" },
      { businessId: 6, category: "pastries", name: "Blueberry Scone", description: "Fresh blueberries in buttery scone", price: "3.75" },
      { businessId: 6, category: "sandwiches", name: "Breakfast Sandwich", description: "Egg, cheese, and bacon on fresh bread", price: "7.50" },

      // Petit Pierre Bakery menu items
      { businessId: 7, category: "pastries", name: "Fruit Tart", description: "Seasonal fresh fruit on pastry cream", price: "5.75" },
      { businessId: 7, category: "pastries", name: "Éclair", description: "Choux pastry with vanilla cream", price: "4.50" },
      { businessId: 7, category: "pastries", name: "Madeleine", description: "Traditional French shell-shaped cake", price: "2.25" },
      { businessId: 7, category: "beverages", name: "French Roast Coffee", description: "Dark roast with rich flavor", price: "3.25" },

      // La Parisienne French Bakery menu items
      { businessId: 8, category: "pastries", name: "Macarons", description: "Assorted flavors (6 pack)", price: "15.00" },
      { businessId: 8, category: "pastries", name: "Opera Cake", description: "Layered almond sponge with chocolate", price: "6.50" },
      { businessId: 8, category: "pastries", name: "Paris-Brest", description: "Choux pastry with praline cream", price: "5.25" },
      { businessId: 8, category: "beverages", name: "Café au Lait", description: "Coffee with steamed milk", price: "4.00" }
    ];

    sampleMenuItems.forEach(item => {
      this.createMenuItem(item);
    });

    // Seattle bakery reviews
    const sampleReviews: InsertReview[] = [
      {
        businessId: 1,
        authorName: "Jessica Chen",
        rating: 5,
        comment: "This is the bakery of my dreams! They have everything I love, from cakes, croissants, sandwiches, macarons, and other amazing pastries. The chocolate croissant was so flaky and delicious."
      },
      {
        businessId: 1,
        authorName: "Michael Torres",
        rating: 4,
        comment: "Amazing selection of fresh baked goods. The Italian roll with salami and provolone is my favorite. Reminds me of the bakeries in New York with fresh ingredients and so many options."
      },
      {
        businessId: 2,
        authorName: "Sarah Williams",
        rating: 5,
        comment: "Authentic French bakery downtown! Everything is freshly baked and not overly sweet. The pain au chocolat is perfect - buttery, flaky, and just the right amount of chocolate."
      },
      {
        businessId: 2,
        authorName: "Antoine Dubois",
        rating: 4,
        comment: "As a French person living in Seattle, this place brings me back home. The croissants are genuine and the baguettes have that perfect crust."
      },
      {
        businessId: 3,
        authorName: "Kenji Nakamura",
        rating: 5,
        comment: "Love this cute little bakery in Chinatown! The melon pan is authentic and freshly baked. You can see all their beautiful pastries displayed in the windows."
      },
      {
        businessId: 3,
        authorName: "Lisa Park",
        rating: 4,
        comment: "Great Japanese bakery with traditional flavors. The an pan is perfectly sweet and the curry bread is surprisingly delicious. Staff is very friendly."
      },
      {
        businessId: 4,
        authorName: "Elena Petrov",
        rating: 5,
        comment: "The sweet scent of freshly baked bread draws you in immediately. The beef piroshky is amazing - flaky pastry with perfectly seasoned filling. Authentic Russian flavors!"
      },
      {
        businessId: 4,
        authorName: "David Rodriguez",
        rating: 4,
        comment: "Pike Place Market classic! The potato and cheese piroshky is hearty and delicious. Always a line but moves quickly. Great for a quick lunch."
      },
      {
        businessId: 5,
        authorName: "Jennifer Walsh",
        rating: 5,
        comment: "Perfect place to enjoy a warm cup of coffee and freshly baked bread! Their sourdough is some of the best in Seattle. Cozy neighborhood feel in Fremont."
      },
      {
        businessId: 6,
        authorName: "Alex Thompson",
        rating: 4,
        comment: "Great spot near the University! Perfect location for students with delicious pastries and reasonable prices. The cinnamon rolls are huge and amazing."
      },
      {
        businessId: 7,
        authorName: "Marie Leclerc",
        rating: 5,
        comment: "Wonderful French bakery with delightful pastries both sweet and savory! The fruit tarts are works of art and taste even better than they look."
      },
      {
        businessId: 8,
        authorName: "Robert Kim",
        rating: 4,
        comment: "Everything is freshly baked and delicious in Belltown. The staff is nice and friendly. Their macarons are authentic French quality - worth the price!"
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
