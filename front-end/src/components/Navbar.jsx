import React from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/CraftCuriologo.jpg";

const Navbar = () => {
  return (
    <nav
      className="bg-white border-b-2 border-black"
      style={{ height: "64px", display: "flex", alignItems: "center", padding: "0 24px" }}
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
          <img src={logo} alt="CraftCurio logo" height={32} width={32} style={{ display: "block", objectFit: "cover" }} />
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#000" }}>CraftCurio</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ul style={{ display: "flex", alignItems: "center", gap: "24px", listStyle: "none", margin: 0, padding: 0 }}>
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
      </div>
    </nav>
  );
};

export default Navbar;
