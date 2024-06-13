"use client";

import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="flex items-center gap-x-4 p-5 bg-green-400">
      <div className="hidden lg:flex lg:flex-1">Search</div>
      <UserButton />
      NavBar
    </div>
  );
};
