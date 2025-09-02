"use client";

import { useState } from "react";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isOrganic: boolean;
  farmer: string;
  inStock: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating,
  reviews,
  isOrganic,
  farmer,
  inStock,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="product-card p-4">
      {/* Image */}
      <div className="relative mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-xl"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isOrganic && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              Organic
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Rating bubble */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 shadow-sm flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
          <span className="text-xs font-medium text-gray-700">{rating}</span>
        </div>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <span className="text-xs text-gray-500 capitalize">{category}</span>
        <h3 className="font-semibold text-gray-900 line-clamp-2">{name}</h3>
        <p className="text-sm text-gray-500">by {farmer}</p>

        {/* Price + Add */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            disabled={!inStock}
            className={`p-2 rounded-lg transition-colors ${
              inStock
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
