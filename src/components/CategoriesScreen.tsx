'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Car,
  ChevronRight,
  Dumbbell,
  GraduationCap,
  Heart,
  Home,
  MoreHorizontal,
  PawPrint,
  Plane,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Tv,
  Utensils,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';
import { formatCurrency } from '../lib/currency';
import { CategoryItem } from '../lib/types';

// Map icon string to Lucide icon component
export function getCategoryIconComponent(iconType?: string) {
  switch (iconType?.toLowerCase()) {
    case 'food':
    case 'dining':
    case 'utensils':
      return Utensils;
    case 'shopping':
      return ShoppingBag;
    case 'transport':
    case 'car':
      return Car;
    case 'bills':
    case 'home':
      return Home;
    case 'entertainment':
    case 'game':
      return Tv;
    case 'health':
    case 'healthcare':
      return Heart;
    case 'education':
      return GraduationCap;
    case 'travel':
    case 'plane':
      return Plane;
    case 'fitness':
    case 'dumbbell':
      return Dumbbell;
    case 'work':
    case 'salary':
    case 'briefcase':
      return Briefcase;
    case 'pet':
    case 'pets':
      return PawPrint;
    default:
      return MoreHorizontal;
  }
}

export function CategoriesScreen() {
  const { categories, navigateTo, openModal, setSelectedCategory } = useSpendWise();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditCategory = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    openModal('EDIT_CATEGORY');
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    openModal('ADD_CATEGORY');
  };

  return (
    <div className="relative flex-1 w-full min-h-0 flex flex-col overflow-hidden animate-fade-in">
      {/* Scrollable Categories List */}
      <div className="flex-1 w-full overflow-y-auto px-5 pt-3 pb-24 flex flex-col gap-4 no-scrollbar font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0 pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('HOME')}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white cursor-pointer"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 stroke-[1.8]" />
            </button>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#777169] dark:text-[#a8a29e] font-sans font-semibold">
                Organization
              </span>
              <h1 className="font-display text-2xl font-light tracking-tight text-[#0c0a09] dark:text-[#ffffff]">
                Categories
              </h1>
            </div>
          </div>

          <button
            onClick={handleAddCategory}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center shadow-xs transition active:scale-95 text-[#0c0a09] dark:text-white cursor-pointer"
            aria-label="Add Category"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777169] dark:text-[#a8a29e] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] text-xs text-[#0c0a09] dark:text-white placeholder:text-[#a8a29e] focus:outline-none focus:border-[#0c0a09] dark:focus:border-white shadow-xs transition font-sans"
            />
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="w-10 h-10 rounded-lg bg-white dark:bg-[#181615] border border-[#d6d3d1] dark:border-white/[0.08] flex items-center justify-center shadow-xs text-[#777169] dark:text-[#a8a29e] transition active:scale-95 shrink-0 cursor-pointer"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[1.8]" />
          </button>
        </div>

        {/* Category List */}
        <div className="flex flex-col gap-2">
          {filteredCategories.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#777169] dark:text-[#a8a29e] rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08]">
              No categories found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const Icon = getCategoryIconComponent(cat.iconType);
              const color = cat.colorHex || '#a8a29e';

              return (
                <div
                  key={cat.id}
                  onClick={() => handleEditCategory(cat)}
                  className="group p-3.5 rounded-2xl bg-white dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:border-[#0c0a09] dark:hover:border-white/20 transition active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    {/* Category Icon Badge */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#f0efed] dark:bg-[#24211e] border border-transparent dark:border-white/[0.04]"
                      style={{
                        color: color,
                      }}
                    >
                      <Icon className="w-4 h-4 stroke-[1.8]" />
                    </div>

                    <div>
                      <h2 className="font-medium text-xs sm:text-[13px] text-[#0c0a09] dark:text-white leading-tight">
                        {cat.name}
                      </h2>
                      <p className="text-[11px] text-[#777169] dark:text-[#a8a29e] mt-0.5">
                        {formatCurrency(cat.spentAmount || 0)} spent • {cat.transactionCount || 0} transactions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-[#a8a29e] group-hover:text-[#0c0a09] dark:group-hover:text-white transition">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Static Pinned Add Category Ink Pill Button */}
      <div className="absolute bottom-3 left-5 right-5 z-20 pointer-events-auto">
        <button
          onClick={handleAddCategory}
          className="w-full py-3.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:hover:bg-[#f0efed] text-white dark:text-[#0c0a09] font-medium text-xs shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Add New Category</span>
        </button>
      </div>
    </div>
  );
}
