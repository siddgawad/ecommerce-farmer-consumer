"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid3X3, List } from "lucide-react";

// Mock data - in a real app, this would come from an API
const mockProducts = [
  {
    id: "1",
    name: "Bell Pepper Red",
    price: 1.15,
    originalPrice: 2.2,
    image:
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop",
    category: "vegetables",
    rating: 4.5,
    inStock: true,
  },
  {
    id: "2",
    name: "Red Tomato",
    price: 0.99,
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=300&fit=crop",
    category: "vegetables",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "3",
    name: "Organic Bananas",
    price: 1.99,
    image:
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&h=300&fit=crop",
    category: "fruits",
    rating: 4.2,
    inStock: true,
  },
  {
    id: "4",
    name: "Fresh Oranges",
    price: 2.49,
    originalPrice: 3.2,
    image:
      "https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop",
    category: "fruits",
    rating: 4.6,
    inStock: false,
  },
  {
    id: "5",
    name: "Fresh Carrots",
    price: 1.99,
    image:
      "https://images.unsplash.com/photo-1447175008436-170170e0ae1b?w=300&h=300&fit=crop",
    category: "vegetables",
    rating: 4.5,
    inStock: true,
  },
  {
    id: "6",
    name: "Organic Blueberries",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=300&h=300&fit=crop",
    category: "fruits",
    rating: 4.9,
    inStock: true,
  },
  {
    id: "7",
    name: "Fresh Kale",
    price: 2.99,
    image:
      "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=300&h=300&fit=crop",
    category: "vegetables",
    rating: 4.4,
    inStock: true,
  },
  {
    id: "8",
    name: "Organic Apples",
    price: 3.49,
    originalPrice: 4.49,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
    category: "fruits",
    rating: 4.8,
    inStock: true,
  },
];

const categories = ["All", "Vegetables", "Fruits", "Dairy", "Meat", "Snacks"];

export default function ProductsPage() {
  const [products] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    let filtered = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            Fresh groceries delivered to your door
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="popular">Most Popular</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="flex border border-gray-200 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${
                    viewMode === "grid"
                      ? "bg-green-600 text-white"
                      : "text-gray-600"
                  } rounded-l-xl transition-colors`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${
                    viewMode === "list"
                      ? "bg-green-600 text-white"
                      : "text-gray-600"
                  } rounded-r-xl transition-colors`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
                {product.originalPrice && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    SALE
                  </span>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                  ♡
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600">
                    {product.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button
                    disabled={!product.inStock}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                      product.inStock
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
