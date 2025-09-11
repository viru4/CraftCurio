import React from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";


const Navbar = () => {
  return (
    <nav
      className="bg-white border-b-2 border-black dark:bg-black"
      style={{ height: "64px", display: "flex", alignItems: "center", padding: "0 16px", position: "sticky", top: 0, zIndex: 50 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src={"/cc_favicon.png"} alt="CraftCurio logo" height={32} width={32} style={{ display: "block", objectFit: "cover" }} />
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#000" }}>CraftCurio</span>
        </Link>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: "16px" }}>
          <ul className="hidden md:flex" style={{ alignItems: "center", gap: "24px", listStyle: "none", margin: 0, padding: 0 }}>
            <li><Link to="/" style={{ textDecoration: "none", color: "#000" }}>Home</Link></li>
            <li><Link to="/about" style={{ textDecoration: "none", color: "#000" }}>About</Link></li>
            <li><Link to="/contact" style={{ textDecoration: "none", color: "#000" }}>Contact</Link></li>
          </ul>

          <SignedOut>
            <Link to="/sign-in">
              <Button size="sm">Login</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Link to="/" style={{ textDecoration: "none", color: "#000" }}>Home</Link>
                <Link to="/about" style={{ textDecoration: "none", color: "#000" }}>About</Link>
                <Link to="/contact" style={{ textDecoration: "none", color: "#000" }}>Contact</Link>
                <div style={{ height: 1, background: "#e5e7eb", margin: "8px 0" }} />
                <SignedOut>
                  <Link to="/sign-in">
                    <Button size="sm" style={{ width: "100%" }}>Login</Button>
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
    </nav>
  );
};

export default Navbar;
