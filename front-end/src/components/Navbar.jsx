import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CraftCurioLogo from "../assets/CraftCuriologo.jpg";

const Navbar = () => {
  const [search, setSearch] = useState("");

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md" style={{ minHeight: "64px" }}>
      {/* Logo: left */}
      <Link to="/">
        <img src={CraftCurioLogo} alt="CraftCurio Logo" height={32} width={32}  className="h-10 w-auto" style={{ objectFit: "contain" }} />
      </Link>

      {/* Search bar: center */}
      <div className="flex-1 flex justify-center px-4">
        <Input
          type="text"
          placeholder="Search unique crafts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-lg px-3 py-2"
        />
      </div>

      {/* Login/User button: right */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
