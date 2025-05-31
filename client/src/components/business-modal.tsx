import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Business, MenuItem, Review } from "@shared/schema";

interface BusinessModalProps {
  businessId: number;
  onClose: () => void;
}

export default function BusinessModal({ businessId, onClose }: BusinessModalProps) {
  const [activeTab, setActiveTab] = useState("menu");

  const { data: business } = useQuery<Business>({
    queryKey: [`/api/businesses/${businessId}`],
  });

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: [`/api/businesses/${businessId}/menu`],
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: [`/api/businesses/${businessId}/reviews`],
  });

  if (!business) return null;

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const tabs = [
    { key: "menu", label: "Menu", icon: "fas fa-utensils" },
    { key: "hours", label: "Hours & Info", icon: "fas fa-clock" },
    { key: "reviews", label: "Reviews", icon: "fas fa-star" },
  ];

  // Placeholder addToCart function
  const addToCart = (item: MenuItem, businessId: number) => {
    console.log(`Added ${item.name} from business ${businessId} to cart`);
    // Implement your cart logic here (e.g., using context or state management)
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed inset-4 md:inset-8 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-4xl mx-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Business Image */}
          <div className="relative">
            <img 
              src={business.imageUrl} 
              alt={`${business.name} storefront`} 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                business.isOpen 
                  ? "bg-green-500 text-white" 
                  : "bg-red-500 text-white"
              }`}>
                <i className="fas fa-clock mr-1"></i>
                {business.isOpen ? `Open until ${business.openUntil}` : business.openUntil}
              </span>
            </div>
          </div>

          {/* Business Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < Math.floor(parseFloat(business.rating)) ? '' : 'text-gray-300'}`}></i>
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">{business.rating}</span>
                  <span className="text-gray-600 ml-2">({business.reviewCount} reviews)</span>
                </div>
                <p className="text-gray-600 mb-4">{business.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm capitalize">
                    {business.category}
                  </span>
                  {business.tags.map((tag) => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:ml-6 flex-shrink-0">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-gray-400 w-4 mr-3"></i>
                    <span>{business.address}</span>
                  </div>
                  {business.phone && (
                    <div className="flex items-center">
                      <i className="fas fa-phone text-gray-400 w-4 mr-3"></i>
                      <span>{business.phone}</span>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center">
                      <i className="fas fa-globe text-gray-400 w-4 mr-3"></i>
                      <a href={`https://${business.website}`} className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {business.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <i className="fas fa-walking text-gray-400 w-4 mr-3"></i>
                    <span>{business.distance} miles away</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors text-sm">
                    <i className="fas fa-directions mr-2"></i>Get Directions
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    <i className="fas fa-heart mr-2"></i>Save to Favorites
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.key
                        ? "bg-white text-amber-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>{tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "menu" && (
                <div className="space-y-6">
                  {Object.entries(groupedMenuItems).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="font-semibold text-lg text-gray-900 mb-3 capitalize">
                        {category.replace('-', ' ')}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 ml-4">
                              <span className="font-semibold text-green-600">${item.price}</span>
                              <button
                                onClick={() => addToCart(item, businessId)}
                                className="bg-amber-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-amber-700 transition-colors"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "hours" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 mb-4">Hours of Operation</h4>
                    <div className="space-y-2">
                      {Object.entries(business.hours as Record<string, string>).map(([day, hours]) => (
                        <div key={day} className="flex justify-between py-2">
                          <span className="font-medium text-gray-900 capitalize">{day}</span>
                          <span className="text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 mb-4">Features</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {business.tags.includes('wifi') && (
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-wifi text-green-500"></i>
                          <span>Free WiFi</span>
                        </div>
                      )}
                      {business.tags.includes('vegan') && (
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-leaf text-green-500"></i>
                          <span>Vegan Options</span>
                        </div>
                      )}
                      {business.tags.includes('organic') && (
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-seedling text-green-500"></i>
                          <span>Organic Ingredients</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-wheelchair text-green-500"></i>
                        <span>Wheelchair Accessible</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-credit-card text-green-500"></i>
                        <span>Card Payments</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-medium">
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{review.authorName}</h5>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-gray-300'}`}></i>
                            ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {reviews.length === 0 && (
                    <div className="text-center py-8">
                      <i className="fas fa-comment text-gray-400 text-3xl mb-2"></i>
                      <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}