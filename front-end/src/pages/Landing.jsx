import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import landingBg from '@/assets/LandingPagebackground.png'
import ceramicDishes from '@/assets/corousel images/ceramicDishes.jpg'
import handcraftedGoods from '@/assets/corousel images/handcraftedGoods.jpg'
import pottery from '@/assets/corousel images/pottery.jpg'
import traditionalBowls from '@/assets/corousel images/traditionalBowls.jpg'
import woodworking from '@/assets/corousel images/woodworking.jpg'
import { Carousel, CarouselItem, CarouselPrevious, CarouselNext, useCarouselControls } from '@/components/ui/carousel'

export default function Landing() {
  function onSearch(e) {
    e.preventDefault();
    // handle search submit
  }

  return (
    <>
      <Navbar />
      <section
        className="relative flex items-center justify-center"
        style={{
          minHeight: "calc(100vh - 64px)",
          padding: "24px"
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${landingBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: "scale(1.05)",
            zIndex: 0,
            pointerEvents: "none"
          }}
        />
        <div
          className="w-full max-w-6xl"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", position: "relative", zIndex: 1 }}
        >
          <h1 className="text-2xl md:text-3xl font-serif" style={{ color: "biege" }}>Find your next handcrafted treasure</h1>

          {/* Main content area with text and search */}
          <div className="w-full flex flex-col lg:flex-row gap-8 items-start lg:items-start">
            {/* Left side - Text area about website */}
            <div className="flex-1 lg:max-w-lg">
              <div className="backdrop-blur-md rounded-lg p-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                <h2 className="text-xl font-serif font-semibold text-white mb-4 drop-shadow-lg">About CraftCurio</h2>
                <p className="text-white/90 font-serif leading-relaxed mb-4 drop-shadow-md">
                  Discover the beauty of handcrafted treasures from skilled artisans around the world. 
                  Each piece tells a unique story of tradition, creativity, and passion.
                </p>
                <p className="text-white/90 font-serif leading-relaxed mb-4 drop-shadow-md">
                  From intricate pottery and woven textiles to hand-carved woodwork and delicate jewelry, 
                  our curated collection celebrates the artistry and craftsmanship that makes each item truly special.
                </p>
                <p className="text-white/90 font-serif leading-relaxed drop-shadow-md">
                  Join our community of art lovers and collectors who appreciate the value of authentic, 
                  handmade creations that bring warmth and character to your home.
                </p>
              </div>
            </div>

            {/* Right side - Search bar */}
            <div className="flex-1 lg:max-w-sm lg:ml-8">
              <form onSubmit={onSearch} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                <Input
                  placeholder="Search handcrafted curios..."
                  className="font-serif bg-white/90 text-amber-950 placeholder:text-amber-950/60 border-amber-900/20 focus-visible:border-amber-700 focus-visible:ring-amber-700/30"
                />
                <Button
                  type="submit"
                  className="font-serif bg-amber-200 text-amber-950 border border-amber-900/20 hover:bg-amber-300 w-24 h-8 text-sm px-3"
                >
                  <Search className="mr-1 h-3 w-3" />
                  Search
                </Button>
              </form>
            </div>
          </div>

          <div style={{ width: "50%", marginTop: "100px" }}>
            <ProductCarousel />
          </div>

          <p className="text-sm md:text-base font-serif" style={{ color: "#3b2f2f" }}>
            Carefully curated by artisans.
          </p>
        </div>
      </section>
    </>
  )
}

function ProductCarousel() {
  const [api, setApi] = useState(null)
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarouselControls(api)

  const products = [
    { id: 1, image: ceramicDishes, title: "Ceramic Dishes" },
    { id: 2, image: handcraftedGoods, title: "Handcrafted Goods" },
    { id: 3, image: pottery, title: "Artisan Pottery" },
    { id: 4, image: traditionalBowls, title: "Traditional Bowls" },
    { id: 5, image: woodworking, title: "Woodworking Crafts" }
  ]

  React.useEffect(() => {
    if (!api) return
    const intervalId = setInterval(() => {
      api.scrollNext()
    }, 3000)
    return () => clearInterval(intervalId)
  }, [api])

  return (
    <div className="relative" style={{ padding: "8px 0" }}>
      <Carousel setApi={setApi} className="w-full" opts={{ align: 'center', loop: true, slidesToScroll: 1 }}>
        {products.map((p) => (
          <CarouselItem key={p.id} className="basis-full px-2">
            <div className="rounded-lg overflow-hidden">
              <div className="aspect-[16/9] w-full bg-amber-50/60 flex items-center justify-center overflow-hidden">
                <img src={p.image} alt="Product" className="h-full w-full object-cover" />
              </div>
            </div>
          </CarouselItem>
        ))}
      </Carousel>
      <CarouselPrevious onClick={scrollPrev} disabled={!canScrollPrev} />
      <CarouselNext onClick={scrollNext} disabled={!canScrollNext} />
    </div>
  )
}
