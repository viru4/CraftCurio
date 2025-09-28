import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SearchBar } from "@/components/search";

import { isValidPublishableKey } from '@/lib/utils'

const hasClerk = isValidPublishableKey(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (query.trim()) {
      // Navigate to collectibles page with search query
      navigate(`/collectibles?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handlePopularTagClick = (tag) => {
    setSearchQuery(tag);
    handleSearch(tag);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-b-[#f4f2f0]">
      <div className="flex items-center justify-between whitespace-nowrap px-4 md:px-10 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 text-[var(--text-primary)] no-underline">
            <img src="/cc_favicon.png" alt="CraftCurio logo" className="h-8 w-8 rounded" />

            <h2 className="text-2xl font-bold tracking-tight">CraftCurio</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[var(--text-primary)] text-base font-medium hover:text-[var(--primary-color)] transition-colors">Home</Link>
            <Link to="/collectibles" className="text-[var(--text-primary)] text-base font-medium hover:text-[var(--primary-color)] transition-colors">Collectibles</Link>
            <Link to="/artisans" className="text-[var(--text-primary)] text-base font-medium hover:text-[var(--primary-color)] transition-colors">Artisan Products</Link>
            <a href="#" className="text-[var(--text-primary)] text-base font-medium hover:text-[var(--primary-color)] transition-colors">About Us</a>
          </nav>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-end gap-4">
          <div className="min-w-40 max-w-64">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search for treasures..."
              popularTags={['Vintage Coins', 'Comics', 'Antiques', 'Stamps']}
              onPopularTagClick={handlePopularTagClick}
              showPopularTags={false}
              size="small"
              className="!max-w-none !px-0"
            />
          </div>
          <div className="flex gap-2">
            {hasClerk ? (
              <>
                <SignedOut>
                  <Link to="/sign-in" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[var(--primary-color)] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">Sign In</Link>
                </SignedOut>
                <SignedIn>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--secondary-color)] text-[var(--text-primary)] hover:bg-gray-200 transition-colors mr-2">
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--secondary-color)] text-[var(--text-primary)] hover:bg-gray-200 transition-colors mr-2">
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </>
            ) : (
              <Link to="/sign-in" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[var(--primary-color)] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">Sign In</Link>
            )}
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
                {/* Mobile Search */}
                <div className="mb-4">
                  <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearch={handleSearch}
                    placeholder="Search for treasures..."
                    popularTags={['Vintage Coins', 'Comics', 'Antiques', 'Stamps']}
                    onPopularTagClick={handlePopularTagClick}
                    showPopularTags={false}
                    size="small"
                    className="!max-w-none !px-0"
                  />
                </div>
                <div className="h-px bg-gray-200" />
                <Link to="/" className="text-[var(--text-primary)]">Home</Link>
                <Link to="/collectibles" className="text-[var(--text-primary)]">Collectibles</Link>
                <Link to="/artisans" className="text-[var(--text-primary)]">Artisan Products</Link>
                <a href="#" className="text-[var(--text-primary)]">About Us</a>
                <div className="h-px bg-gray-200" />
                {hasClerk ? (
                  <>
                    <SignedOut>
                      <Link to="/sign-in">
                        <Button size="sm" className="w-full">Sign In</Button>
                      </Link>
                    </SignedOut>
                    <SignedIn>
                      <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                  </>
                ) : (
                  <Link to="/sign-in">
                    <Button size="sm" className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
