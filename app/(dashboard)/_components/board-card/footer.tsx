"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface FooterProps {
  title: string;
  authorLabel: string;
  createAtLabel: string;
  isFavorite: boolean;
  onStar: () => void;
  disabled: boolean;
}

export const Footer = ({ title, authorLabel, createAtLabel, disabled, onStar, isFavorite }: FooterProps) => {
  const handleStar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    onStar();
  };

  return (
    <div className="relative bg-white p-3">
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">{title}</p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        {authorLabel}, {createAtLabel}
      </p>
      <button
        disabled={disabled}
        onClick={handleStar}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-yellow-400",
          disabled && "cursor-not-allowed opacity-75"
        )}
      >
        <Star className={cn("h-4 w-4", isFavorite && "fill-yellow-400 text-yellow-400")} />
      </button>
    </div>
  );
};
