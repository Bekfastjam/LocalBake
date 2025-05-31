export default function Header() {
  const getCartItemCount = () => {
    // TODO: Implement cart item count logic here
    return 0;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <i className="fas fa-bread-slice text-amber-600 text-2xl"></i>
            <h1 className="text-xl font-bold text-gray-900">LocalBakes</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Discover</a>
            <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">For Businesses</a>
            <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-amber-600 transition-colors">Contact</a>
            <div className="relative">
              <button className="text-gray-700 hover:text-amber-600 transition-colors">
                <i className="fas fa-shopping-cart text-xl"></i>
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
            </div>
            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
              Sign In
            </button>
          </nav>
          <button className="md:hidden text-gray-600">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}