import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Groceries
                <br />
                delivered in
                <br />
                <span className="text-green-600">90 minutes</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Get your healthy foods & snacks delivered at your doorsteps all
                day everyday
              </p>
              <div className="flex gap-4 mb-8">
                <Link
                  href="/products"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors"
                >
                  Shop now
                </Link>
                <button className="text-gray-700 hover:text-green-600 px-8 py-4 text-lg font-medium transition-colors">
                  Download App
                </button>
              </div>

              {/* Search Bar */}
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="bg-green-50 rounded-3xl p-8 lg:p-12">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop"
                  alt="Fresh groceries"
                  className="w-full h-96 object-cover rounded-2xl"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute top-8 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🥬</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Vegetables</p>
                    <p className="text-sm text-gray-500">20+ fresh items</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🍎</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Fruits</p>
                    <p className="text-sm text-gray-500">15+ fresh items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Popular items</h2>
            <Link
              href="/products"
              className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
            >
              View all
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Bell Pepper Red",
                price: 1.15,
                originalPrice: 2.2,
                image:
                  "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop",
                rating: 4.5,
              },
              {
                name: "Red Tomato",
                price: 0.99,
                image:
                  "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=300&fit=crop",
                rating: 4.8,
              },
              {
                name: "Organic Bananas",
                price: 1.99,
                image:
                  "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&h=300&fit=crop",
                rating: 4.2,
              },
              {
                name: "Fresh Oranges",
                price: 2.49,
                originalPrice: 3.2,
                image:
                  "https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop",
                rating: 4.6,
              },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
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
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                    ♡
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">
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
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
