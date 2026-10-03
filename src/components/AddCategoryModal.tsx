'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Car,
  ChevronDown,
  Dumbbell,
  GraduationCap,
  Heart,
  Home,
  MoreHorizontal,
  PawPrint,
  Plane,
  ShoppingBag,
  Tag,
  Trash2,
  Tv,
  Utensils,
} from 'lucide-react';
import { useSpendWise } from '../context/SpendWiseContext';

const ICONS_GRID = [
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'bills', label: 'Bills', icon: Home },
  { id: 'entertainment', label: 'Entertainment', icon: Tv },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'pet', label: 'Pets', icon: PawPrint },
  { id: 'other', label: 'Other', icon: MoreHorizontal },
];

const COLOR_PALETTE = [
  { id: 'blue', hex: '#3B82F6' },
  { id: 'pink', hex: '#FB7185' },
  { id: 'violet', hex: '#A855F7' },
  { id: 'peach', hex: '#F97316' },
  { id: 'yellow', hex: '#FACC15' },
  { id: 'mint', hex: '#34D399' },
];

export function AddCategoryModal() {
  const {
    activeModal,
    closeModal,
    selectedCategory,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useSpendWise();

  const isEdit = activeModal === 'EDIT_CATEGORY';
  const isOpen = activeModal === 'ADD_CATEGORY' || isEdit;

  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('shopping');
  const [selectedColor, setSelectedColor] = useState('#FB7185');

  useEffect(() => {
    if (isEdit && selectedCategory) {
      setName(selectedCategory.name);
      setSelectedIcon(selectedCategory.iconType || 'shopping');
      setSelectedColor(selectedCategory.colorHex || '#FB7185');
    } else {
      setName('');
      setSelectedIcon('shopping');
      setSelectedColor('#FB7185');
    }
  }, [isEdit, selectedCategory, isOpen]);

  if (!isOpen) return null;

  const ActiveIconComponent =
    ICONS_GRID.find((it) => it.id === selectedIcon)?.icon || ShoppingBag;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEdit && selectedCategory) {
      updateCategory({
        ...selectedCategory,
        name: name.trim(),
        iconType: selectedIcon,
        colorHex: selectedColor,
      });
    } else {
      addCategory({
        name: name.trim(),
        iconType: selectedIcon,
        colorHex: selectedColor,
      });
    }
  };

  const handleDelete = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[390px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-[32px] bg-[#FAF8F5] dark:bg-zinc-900 border border-white/60 dark:border-white/10 shadow-2xl p-5 flex flex-col gap-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
          </button>

          <h2 className="font-bold text-base text-zinc-900 dark:text-white">
            {isEdit ? 'Edit Category' : 'Add Category'}
          </h2>

          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md flex items-center justify-center border border-zinc-200/80 dark:border-white/10 shadow-xs transition active:scale-95"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
          </button>
        </div>

        {/* Diffuse Glowing Orb & Center Icon */}
        <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
          {/* Ambient Glowing Orb */}
          <div
            className="absolute w-32 h-32 rounded-full blur-2xl opacity-60 pointer-events-none transition-colors duration-500"
            style={{
              background: `radial-gradient(circle, ${selectedColor} 0%, transparent 70%)`,
            }}
          />

          {/* Floating Icon Circle */}
          <div
            className="relative w-20 h-20 rounded-full bg-white dark:bg-zinc-800 shadow-md border-2 flex items-center justify-center transition-all duration-300"
            style={{
              borderColor: `${selectedColor}40`,
              color: selectedColor,
            }}
          >
            <ActiveIconComponent className="w-9 h-9 stroke-[2]" />
          </div>

          <button
            type="button"
            className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
          >
            <span>Change Icon</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
              Category Name
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 shadow-xs">
              <Tag className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                className="w-full bg-transparent text-xs font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Choose an Icon (4x3 Grid) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                Choose an Icon
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                See All
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {ICONS_GRID.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIcon(item.id)}
                    className={`h-11 rounded-2xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-2 shadow-xs scale-105'
                        : 'bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-white/5 text-zinc-500 hover:text-zinc-800'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: selectedColor,
                            backgroundColor: `${selectedColor}15`,
                            color: selectedColor,
                          }
                        : {}
                    }
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choose a Color Swatches */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
              Choose a Color
            </span>
            <div className="flex items-center justify-between px-1">
              {COLOR_PALETTE.map((color) => {
                const isSelected = selectedColor === color.hex;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.hex)}
                    className={`w-9 h-9 rounded-full transition-transform ${
                      isSelected ? 'scale-110 ring-2 ring-offset-2 ring-zinc-400' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Preview Card */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
              Preview
            </span>
            <div className="p-3 rounded-2xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${selectedColor}18`,
                  color: selectedColor,
                }}
              >
                <ActiveIconComponent className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white">
                  {name.trim() || 'Shopping'}
                </h4>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  This category will appear in your transactions
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shadow-md hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <span>{isEdit ? 'Save Changes →' : 'Create Category →'}</span>
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-3 rounded-full border border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100/50 active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Category</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
