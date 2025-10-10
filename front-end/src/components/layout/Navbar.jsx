import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {

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
        <div className="hidden md:flex items-center gap-4">
          <Link to="/sign-in" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[var(--primary-color)] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">Sign In</Link>
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
                <Link to="/collectibles" className="text-[var(--text-primary)]">Collectibles</Link>
                <Link to="/artisans" className="text-[var(--text-primary)]">Artisan Products</Link>
                <a href="#" className="text-[var(--text-primary)]">About Us</a>
                <div className="h-px bg-gray-200" />
                <Link to="/sign-in">
                  <Button size="sm" className="w-full">Sign In</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
