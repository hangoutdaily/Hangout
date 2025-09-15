"use client";

import { Music, Mic, UtensilsCrossed, GlassWater } from "lucide-react";

const categories = [
  { label: "Music", icon: Music, active: true },
  { label: "Comedy", icon: Mic, active: true },
  { label: "Brunch", icon: GlassWater, active: true },
  { label: "Dinner", icon: UtensilsCrossed, active: false },
];

export default function CategoryFilters() {
  return (
    <div className="flex gap-2 px-4 mt-3 overflow-x-auto no-scrollbar">
      {categories.map(({ label, icon: Icon, active }) => (
        <button
          key={label}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
            active
              ? "bg-foreground text-background"
              : "bg-surface text-foreground hover:bg-foreground/10"
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
