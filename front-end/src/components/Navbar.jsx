import React from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-b-[#f4f2f0]">
      <div className="flex items-center justify-between whitespace-nowrap px-4 md:px-10 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 text-[var(--text-primary)] no-underline">
            <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <g clipPath="url(#clip0_6_330)">
                <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
              </g>
              <defs>
                <clipPath id="clip0_6_330"><rect fill="white" height="48" width="48"></rect></clipPath>
              </defs>
            </svg>
            <h2 className="text-2xl font-bold tracking-tight">CraftCurio</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[var(--text-primary)] text-base font-medium hover:text-[var(--primary-color)] transition-colors">Home</Link>
            <a href="#" className="text-[var(--text-primary)] text-base font-medium hover:text-[var(--primary-color)] transition-colors">Collectibles</a>
            <a href="#" className="text-[var(--text-primary)] text-base font-medium hover:text-[var(--primary-color)] transition-colors">Artisan Products</a>
            <a href="#" className="text-[var(--text-primary)] text-base font-medium hover:text-[var(--primary-color)] transition-colors">About Us</a>
          </nav>
        </div>
        <div className="hidden lg:flex flex-1 items-center justify-end gap-4">
          <label className="flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-full h-full">
              <div className="text-[var(--text-secondary)] flex border-none bg-[var(--secondary-color)] items-center justify-center pl-4 rounded-l-full border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-[var(--text-primary)] focus:outline-0 focus:ring-0 border-none bg-[var(--secondary-color)] focus:border-none h-full placeholder:text-[var(--text-secondary)] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search for treasures" defaultValue="" />
            </div>
          </label>
          <div className="flex gap-2">
            <SignedOut>
              <Link to="/sign-in" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[var(--primary-color)] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">Sign In</Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4">
                <Link to="/" className="text-[var(--text-primary)]">Home</Link>
                <a href="#" className="text-[var(--text-primary)]">Collectibles</a>
                <a href="#" className="text-[var(--text-primary)]">Artisan Products</a>
                <a href="#" className="text-[var(--text-primary)]">About Us</a>
                <div className="h-px bg-gray-200" />
                <SignedOut>
                  <Link to="/sign-in">
                    <Button size="sm" className="w-full">Sign In</Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
