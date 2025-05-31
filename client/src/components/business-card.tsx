import type { Business } from "@shared/schema";

interface BusinessCardProps {
  business: Business;
  onClick: () => void;
}

export default function BusinessCard({ business, onClick }: BusinessCardProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <img 
        src={business.imageUrl} 
        alt={`${business.name} storefront`} 
        className="w-full h-48 object-cover rounded-t-xl"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-900 text-lg">{business.name}</h4>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            business.isOpen 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {business.isOpen ? "Open" : "Closed"}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <i className="fas fa-star text-yellow-400 mr-1"></i>
          <span className="font-medium">{business.rating}</span>
          <span className="mx-1">•</span>
          <span>{business.reviewCount} reviews</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">
          {business.description.slice(0, 80)}... • {business.distance} mi
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            <i className="fas fa-clock mr-1"></i>
            {business.isOpen ? `Closes ${business.openUntil}` : business.openUntil}
          </span>
          <div className="flex space-x-1">
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded capitalize">
              {business.category}
            </span>
            {business.tags.slice(0, 1).map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded capitalize">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
