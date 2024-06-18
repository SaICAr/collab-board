"use client";

import Image from "next/image";

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/empty-favorites.svg" alt="Empty Favorites" width={200} height={200} />

      <h2 className="text-2xl font-semibold mt-6">您当前没有任何收藏</h2>
      <p className="text-muted-foreground text-sm mt-2">试着收藏喜欢的白板吧~</p>
    </div>
  );
};
