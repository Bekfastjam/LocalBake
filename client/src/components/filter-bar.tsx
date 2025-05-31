interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function FilterBar({ activeFilter, setActiveFilter }: FilterBarProps) {
  const filters = [
    { key: "all", label: "All Places", icon: null },
    { key: "bakery", label: "Bakeries", icon: "fas fa-bread-slice" },
    { key: "cafe", label: "Cafes", icon: "fas fa-coffee" },
    { key: "open", label: "Open Now", icon: "fas fa-clock" },
    { key: "vegan", label: "Vegan Options", icon: "fas fa-leaf" },
  ];

  return (
    <section className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-gray-700 font-medium">Filter by:</span>
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.key
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.icon && <i className={`${filter.icon} mr-1`}></i>}
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
