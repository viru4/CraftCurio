import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import landingBg from '@/assets/LandingPagebackground.png'
import sampleImg from '@/assets/CraftCuriologo.jpg'
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
          className="w-full max-w-xl"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", position: "relative", zIndex: 1 }}
        >
          <h1 className="text-2xl md:text-3xl font-serif" style={{ color: "#2a1f1f" }}>Find your next handcrafted treasure</h1>

          <form onSubmit={onSearch} style={{ width: "100%", display: "flex", gap: "8px" }}>
            <Input
              placeholder="Search handcrafted curios..."
              className="font-serif bg-amber-50/80 text-amber-950 placeholder:text-amber-950/60 border-amber-900/20 focus-visible:border-amber-700 focus-visible:ring-amber-700/30"
            />
            <Button
              type="submit"
              className="font-serif bg-amber-200 text-amber-950 border border-amber-900/20 hover:bg-amber-300"
            >
              <Search className="mr-2" />
              Search
            </Button>
          </form>

          <div style={{ width: "100%", marginTop: "24px" }}>
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
    { id: 1, image: sampleImg },
    { id: 2, image: sampleImg },
    { id: 3, image: sampleImg },
    { id: 4, image: sampleImg },
    { id: 5, image: sampleImg }
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
