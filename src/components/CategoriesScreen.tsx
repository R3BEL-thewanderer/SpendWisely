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
      <div className="flex-1 w-full overflow-y-auto px-5 pt-3 pb-24 flex flex-col gap-4 no-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('HOME')}
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95 cursor-pointer"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Categories
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage your spending categories
              </p>
            </div>
          </div>

          <button
            onClick={handleAddCategory}
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95 cursor-pointer"
            aria-label="Add Category"
          >
            <MoreHorizontal className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
            />
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs text-zinc-600 dark:text-zinc-300 transition active:scale-95 shrink-0 cursor-pointer"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Category List */}
        <div className="flex flex-col gap-2.5">
          {filteredCategories.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">
              No categories found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const Icon = getCategoryIconComponent(cat.iconType);
              const color = cat.colorHex || '#3B82F6';

              return (
                <div
                  key={cat.id}
                  onClick={() => handleEditCategory(cat)}
                  className="group p-3.5 rounded-[22px] bg-white/90 dark:bg-zinc-800/85 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Category Icon Badge */}
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${color}18`,
                        color: color,
                      }}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <div>
                      <h2 className="font-bold text-xs text-zinc-900 dark:text-white">
                        {cat.name}
                      </h2>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {formatCurrency(cat.spentAmount || 0)} spent • {cat.transactionCount || 0} transactions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 transition">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 100% STATIC PINNED Add Category Gradient Pill Button */}
      <div className="absolute bottom-3 left-5 right-5 z-20 pointer-events-auto">
        <button
          onClick={handleAddCategory}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Category</span>
        </button>
      </div>
    </div>
  );
}
