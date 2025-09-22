import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { Carousel, CarouselItem, CarouselPrevious, CarouselNext, useCarouselControls } from "@/components/ui/carousel";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative">
          <div className="hero-banner-bg flex min-h-[60vh] lg:min-h-[80vh] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4 text-center">
            <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tighter max-w-4xl">
              Discover Unique Collectibles & Artisan Products
            </h1>
            <p className="text-white text-lg md:text-xl font-normal max-w-2xl">
              Explore a curated selection of handcrafted items and rare collectibles from local artisans.
            </p>
            <a href="#" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-12 px-8 mt-4 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transform hover:scale-105 transition-all">
              <span className="truncate">Shop Now</span>
            </a>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-4 md:px-10 lg:px-20">
          <FeaturedProducts />
        </section>

        {/* Categories */}
        <section className="bg-stone-50 py-16 px-4 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-8 text-center">Explore Our Categories</h2>
            <div className="border-b border-[#e6e0db] mb-8">
              <div className="flex justify-center gap-8">
                <Link to="" className="flex flex-col items-center justify-center border-b-2 border-b-[var(--primary-color)] text-[var(--text-primary)] pb-3 pt-2">
                  <p className="text-base font-bold">Collectibles</p>
                </Link>
                <a href="#" className="flex flex-col items-center justify-center border-b-2 border-b-transparent text-[var(--text-secondary)] pb-3 pt-2 hover:border-b-[var(--primary-color)] hover:text-[var(--text-primary)] transition-colors">
                  <p className="text-base font-bold">Artisan Products</p>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <CardItem title="Vintage Stamps" subtitle="Explore a collection of vintage stamps from around the world." imageClass="category-image-vintage-stamps-bg" compact />
              <CardItem title="Rare Coins" subtitle="Discover rare coins and currency from different eras." imageClass="category-image-rare-coins-bg" compact />
              <CardItem title="Antique Books" subtitle="Find antique books and manuscripts with historical significance." imageClass="category-image-antique-books-bg" compact />
              <CardItem title="Classic Toys" subtitle="Browse classic toys and games from past generations." imageClass="category-image-classic-toys-bg" compact />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4 md:px-10 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-4">How CraftCurio Works</h2>
            <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl mx-auto">A seamless experience for both buyers and artisans. Discover, connect, and thrive in our creative community.</p>
            <div className="grid md:grid-cols-2 gap-12 items-center text-left">
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">For Buyers</h3>
                <Step num={1} title="Discover Treasures" text="Browse through thousands of unique items, from handcrafted jewelry to rare vintage collectibles." filled />
                <Step num={2} title="Connect with Artisans" text="Communicate directly with artisans to ask questions, request custom orders, and learn the story behind their creations." filled />
                <Step num={3} title="Secure Purchase" text="Enjoy a safe and secure checkout process with multiple payment options. Your new treasure will be shipped directly to you." filled />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">For Artisans</h3>
                <Step num={1} title="Create Your Shop" text="Set up your personalized shop in minutes. Showcase your products with high-quality photos and detailed descriptions." />
                <Step num={2} title="Reach a Wider Audience" text="Connect with a passionate community of buyers who appreciate quality craftsmanship and unique finds." />
                <Step num={3} title="Grow Your Business" text="Utilize our tools to manage your inventory, track sales, and grow your creative business with ease." />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-stone-50 py-16 px-4 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-12 text-center">What Our Community Says</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Testimonial name="Sarah L." role="Buyer" avatar="https://lh3.googleusercontent.com/a-/AOh14GhJ1QdY23c_C5E9zY_8Q_Z0j_X_Z_0_0_0_0_0=s96-c" text="I'm so glad I found CraftCurio! I discovered a beautiful handmade necklace that I cherish. The direct communication with the artist was a wonderful touch." rating={5} />
              <Testimonial name="David M." role="Artisan" avatar="https://lh3.googleusercontent.com/a-/AOh14Gg_2QdY23c_C5E9zY_8Q_Z0j_X_Z_0_0_0_0_0=s96-c" text="Selling my pottery on CraftCurio has been a game-changer. The platform is incredibly easy to use, and I've connected with so many amazing customers who truly value my work." rating={4} />
              <Testimonial name="Jessica P." role="Buyer" avatar="https://lh3.googleusercontent.com/a-/AOh14Gg_2QdY23c_C5E9zY_8Q_Z0j_X_Z_0_0_0_0_1=s96-c" text="The quality of the items on this platform is outstanding. I bought a vintage map for my collection, and it exceeded all my expectations. The shipping was fast and secure." rating={4.5} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Shop</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Collectibles</a></li>
                <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Artisan Products</a></li>
                <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Featured Items</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Our Artisans</a></li>
                <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Careers</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook"><svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path></svg></a>
                <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram"><svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" fillRule="evenodd"></path></svg></a>
                <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter"><svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-base text-gray-400">© 2024 CraftCurio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeaturedProducts() {
  const [api, setApi] = useState(null)
  const { canScrollPrev, canScrollNext } = useCarouselControls(api)

  const handleNext = useCallback(() => {
    if (!api) return
    if (api.canScrollNext()) api.scrollNext()
    else api.scrollTo(0)
  }, [api])

  const handlePrev = useCallback(() => {
    if (!api) return
    if (api.canScrollPrev()) api.scrollPrev()
    else {
      const last = (api.scrollSnapList()?.length || 1) - 1
      api.scrollTo(last)
    }
  }, [api])

  const products = [
    { id: 1, title: 'Ceramic Vase', subtitle: 'Handcrafted ceramic vase with unique glaze', imageClass: 'card-image-ceramic-vase-bg' },
    { id: 2, title: 'Vintage Pocket Watch', subtitle: 'Vintage pocket watch with intricate detailing', imageClass: 'card-image-pocket-watch-bg' },
    { id: 3, title: 'Silk Scarf', subtitle: 'Hand-painted silk scarf with floral design', imageClass: 'card-image-silk-scarf-bg' },
    { id: 4, title: 'Wooden Bird Sculpture', subtitle: 'Hand-carved wooden sculpture of a bird', imageClass: 'card-image-bird-sculpture-bg' }
  ]

  useEffect(() => {
    if (!api) return
    const id = setInterval(() => handleNext(), 3000)
    return () => clearInterval(id)
  }, [api, handleNext])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Featured Products</h2>
        <div className="flex gap-2">
          <button onClick={handlePrev} className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--secondary-color)] text-[var(--text-primary)] hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button onClick={handleNext} className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--secondary-color)] text-[var(--text-primary)] hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Carousel setApi={setApi} className="w-full" opts={{ align: 'start', loop: true, slidesToScroll: 1 }}>
          {products.map((p) => (
            <CarouselItem key={p.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2">
              <CardItem title={p.title} subtitle={p.subtitle} imageClass={p.imageClass} />
            </CarouselItem>
          ))}
        </Carousel>
        <CarouselPrevious onClick={handlePrev} />
        <CarouselNext onClick={handleNext} />
      </div>
    </div>
  )
}

function CardItem({ title, subtitle, imageClass, compact = false }) {
  return (
    <div className="group flex h-full flex-col gap-4 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="relative w-full aspect-square">
        <div className={`${imageClass} absolute inset-0 bg-center bg-no-repeat bg-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300`} />
      </div>
      <div className="p-2">
        <p className="text-[var(--text-primary)] text-lg font-semibold">{title}</p>
        <p className="text-[var(--text-secondary)] text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

function Step({ num, title, text, filled = false }) {
  return (
    <div className="flex items-start gap-6 mb-6">
      <div className={`flex-shrink-0 w-12 h-12 rounded-full ${filled ? "bg-[var(--primary-color)] text-white" : "bg-[var(--secondary-color)] text-[var(--primary-color)]"} flex items-center justify-center text-2xl font-bold`}>{num}</div>
      <div>
        <h4 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h4>
        <p className="text-[var(--text-secondary)]">{text}</p>
      </div>
    </div>
  );
}

function Testimonial({ name, role, text, avatar, rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-4">
          <img alt={`${name} avatar`} className="w-12 h-12 rounded-full mr-4" src={avatar} />
          <div>
            <p className="font-semibold text-[var(--text-primary)]">{name}</p>
            <p className="text-sm text-[var(--text-secondary)]">{role}</p>
          </div>
        </div>
        <p className="text-[var(--text-secondary)] italic">{text}</p>
      </div>
      <div className="flex mt-4">
        {Array.from({ length: full }).map((_, i) => (
          <span key={`f-${i}`} className="material-symbols-outlined text-[var(--primary-color)]">star</span>
        ))}
        {half && <span className="material-symbols-outlined text-[var(--primary-color)]">star_half</span>}
        {Array.from({ length: Math.max(0, 5 - full - (half ? 1 : 0)) }).map((_, i) => (
          <span key={`e-${i}`} className="material-symbols-outlined text-gray-300">star</span>
        ))}
      </div>
    </div>
  );
}
