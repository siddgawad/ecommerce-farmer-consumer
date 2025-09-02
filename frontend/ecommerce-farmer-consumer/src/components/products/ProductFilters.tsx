'use client';

import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onOrganicFilter: (organic: boolean) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  onSortChange,
  onPriceRangeChange,
  onOrganicFilter
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [organicOnly, setOrganicOnly] = useState(false);

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    onPriceRangeChange(newRange.min, newRange.max);
  };

  const handleOrganicChange = (checked: boolean) => {
    setOrganicOnly(checked);
    onOrganicFilter(checked);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
        >
          <Filter className="w-4 h-4" />
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={selectedCategory === ""}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
            <select
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="name">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Organic Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Product Type</h4>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => handleOrganicChange(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700">Organic Only</span>
            </label>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              onCategoryChange("");
              onSortChange("name");
              setPriceRange({ min: 0, max: 100 });
              setOrganicOnly(false);
              onPriceRangeChange(0, 100);
              onOrganicFilter(false);
            }}
            className="w-full py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
