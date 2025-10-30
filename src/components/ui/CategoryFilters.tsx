"use client";

import { Zap, UtensilsCrossed, Music, Gamepad2, BookOpen, Camera, Heart } from "lucide-react";
import { useState } from "react";

const categories = [
  { label: "My feed", icon: Zap, active: true },
  { label: "Food", icon: UtensilsCrossed, active: false },
  { label: "Concerts", icon: Music, active: false },
  { label: "Gaming", icon: Gamepad2, active: false },
  { label: "Education", icon: BookOpen, active: false },
  { label: "Photography", icon: Camera, active: false },
  { label: "Dating", icon: Heart, active: false },
];

export default function CategoryFilters() {
  const [activeCategory, setActiveCategory] = useState("My feed");

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Upcoming events</h2>
        <button className="text-sm text-foreground hover:text-accent transition-colors">
          See All
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveCategory(label)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === label
                ? "bg-accent text-accent-foreground"
                : "bg-surface text-foreground hover:bg-accent/10"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
