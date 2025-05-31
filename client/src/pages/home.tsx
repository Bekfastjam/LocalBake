import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Business } from "@shared/schema";
import Header from "@/components/header";
import SearchSection from "@/components/search-section";
import FilterBar from "@/components/filter-bar";
import BusinessCard from "@/components/business-card";
import BusinessModal from "@/components/business-modal";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ["/api/businesses", { 
      category: activeFilter, 
      isOpen: activeFilter === "open" ? true : undefined,
      hasVegan: activeFilter === "vegan",
      query: searchQuery 
    }],
  });

  const handleSearch = () => {
    // Search functionality is handled by the query reactively
    console.log("Searching for:", searchQuery, "in location:", location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <SearchSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
        setLocation={setLocation}
        onSearch={handleSearch}
      />
      
      <FilterBar 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {businesses.length} places near you
          </h3>
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <option>Sort by Distance</option>
              <option>Sort by Rating</option>
              <option>Sort by Name</option>
            </select>
            <div className="flex border border-gray-300 rounded-lg">
              <button className="p-2 bg-amber-600 text-white rounded-l-lg">
                <i className="fas fa-th-large"></i>
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-r-lg">
                <i className="fas fa-map"></i>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-xl h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onClick={() => setSelectedBusinessId(business.id)}
              />
            ))}
          </div>
        )}

        {businesses.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}

        <div className="text-center mt-8">
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Load More Results
          </button>
        </div>
      </main>

      {selectedBusinessId && (
        <BusinessModal 
          businessId={selectedBusinessId}
          onClose={() => setSelectedBusinessId(null)}
        />
      )}

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <i className="fas fa-bread-slice text-amber-600 text-2xl"></i>
                <span className="text-xl font-bold">LocalBakes</span>
              </div>
              <p className="text-gray-300 text-sm">
                Connecting you with the best local bakeries and cafes in your neighborhood.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Users</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Browse Bakeries</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Search by Location</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Save Favorites</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Write Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Businesses</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">List Your Business</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Update Menu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manage Reviews</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium Features</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 LocalBakes. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
