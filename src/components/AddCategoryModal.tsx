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
      <div className="relative w-full max-w-[390px] max-h-[92vh] overflow-y-auto no-scrollbar rounded-2xl bg-[#f5f5f5] dark:bg-[#181615] border border-[#e7e5e4] dark:border-white/[0.08] shadow-2xl p-5 flex flex-col gap-4 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center text-[#0c0a09] dark:text-white shadow-xs transition active:scale-95 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.8]" />
          </button>

          <h2 className="font-display font-light text-base tracking-tight text-[#0c0a09] dark:text-white">
            {isEdit ? 'Edit Category' : 'Add Category'}
          </h2>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center text-[#0c0a09] dark:text-white shadow-xs transition active:scale-95 cursor-pointer"
            aria-label="Options"
          >
            <MoreHorizontal className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Diffuse Glowing Orb & Center Icon */}
        <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
          {/* Ambient Glowing Orb */}
          <div
            className="absolute w-32 h-32 rounded-full blur-2xl opacity-40 pointer-events-none transition-colors duration-500"
            style={{
              background: `radial-gradient(circle, ${selectedColor} 0%, transparent 70%)`,
            }}
          />

          {/* Floating Icon Circle */}
          <div
            className="relative w-16 h-16 rounded-full bg-white dark:bg-[#24211e] shadow-xs border border-[#e7e5e4] dark:border-white/[0.08] flex items-center justify-center transition-all duration-300"
            style={{
              color: selectedColor,
            }}
          >
            <ActiveIconComponent className="w-7 h-7 stroke-[1.8]" />
          </div>

          <button
            type="button"
            className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white transition"
          >
            <span>Change Icon</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">
              Category Name
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#24211e] border border-[#d6d3d1] dark:border-white/[0.08] shadow-xs">
              <Tag className="w-4 h-4 text-[#777169] dark:text-[#a8a29e] shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                className="w-full bg-transparent text-xs font-medium text-[#0c0a09] dark:text-white placeholder:text-[#a8a29e] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Choose an Icon (4x3 Grid) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">
                Choose an Icon
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {ICONS_GRID.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIcon(item.id)}
                    className={`h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border border-[#0c0a09] dark:border-white shadow-xs bg-[#f0efed] dark:bg-white/10 text-[#0c0a09] dark:text-white'
                        : 'bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.06] text-[#777169] dark:text-[#a8a29e] hover:text-[#0c0a09] dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[1.8]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choose a Color Swatches */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">
              Choose an Accent Tone
            </span>
            <div className="flex items-center justify-between px-1">
              {COLOR_PALETTE.map((color) => {
                const isSelected = selectedColor === color.hex;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.hex)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      isSelected ? 'scale-110 ring-2 ring-offset-2 ring-[#0c0a09] dark:ring-white ring-offset-[#f5f5f5] dark:ring-offset-[#181615]' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Preview Card */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#777169] dark:text-[#a8a29e] uppercase tracking-wider">
              Preview
            </span>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#24211e] border border-[#e7e5e4] dark:border-white/[0.08] shadow-xs flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#f0efed] dark:bg-white/5"
                style={{
                  color: selectedColor,
                }}
              >
                <ActiveIconComponent className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="font-medium text-xs text-[#0c0a09] dark:text-white">
                  {name.trim() || 'Shopping'}
                </h4>
                <p className="text-[10px] text-[#777169] dark:text-[#a8a29e]">
                  This category will appear in your ledger
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] dark:bg-white dark:text-[#0c0a09] dark:hover:bg-[#f0efed] text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEdit ? 'Save Changes' : 'Create Category'}</span>
              <span className="text-sm">→</span>
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-3 rounded-full border border-rose-300 dark:border-rose-900/40 bg-transparent text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
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
