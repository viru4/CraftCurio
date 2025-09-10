import React from 'react'
import Navbar from '@/components/Navbar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function Landing() {
  function onSearch(e) {
    e.preventDefault();
    // handle search submit
  }

  return (
    <>
      <Navbar />
      <section
        className="flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 64px)", padding: "24px" }}
      >
        <div
          className="w-full max-w-xl"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
        >
          <h1 className="text-2xl md:text-3xl font-serif" style={{ color: "#3b2f2f" }}>Find your next handcrafted treasure</h1>

          <form onSubmit={onSearch} style={{ width: "100%", display: "flex", gap: "8px" }}>
            <Input
              placeholder="Search handcrafted curios..."
              className="font-serif bg-amber-50/80 text-amber-900 placeholder:text-amber-900/50 border-amber-900/20 focus-visible:border-amber-700 focus-visible:ring-amber-700/30"
            />
            <Button
              type="submit"
              className="font-serif bg-amber-200 text-amber-900 border border-amber-900/20 hover:bg-amber-300"
            >
              <Search className="mr-2" />
              Search
            </Button>
          </form>

          <p className="text-sm md:text-base font-serif" style={{ color: "#6b5b53" }}>
            Carefully curated by artisans.
          </p>
        </div>
      </section>
    </>
  )
}
