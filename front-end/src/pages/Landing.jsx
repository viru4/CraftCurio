import React, { useEffect, useState, useCallback } from "react";
import { Navbar, Footer } from "@/components/layout";
import { Carousel, CarouselItem, CarouselPrevious, CarouselNext, useCarouselControls } from "@/components/ui/carousel";
import { Link } from 'react-router-dom';
import { CategoryGrid } from "@/components/category";

export default function Landing() {
  const [collectibleCategories, setCollectibleCategories] = useState([]);
  const [artisanCategories, setArtisanCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('collectibles');

  // Fetch both collectible and artisan categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [collectibleRes, artisanRes] = await Promise.all([
          fetch('http://localhost:3000/api/categories?type=collectible'),
          fetch('http://localhost:3000/api/categories/artisan/all')
        ]);
        
        const collectibleData = await collectibleRes.json();
        const artisanData = await artisanRes.json();
        
        if (collectibleData.data && Array.isArray(collectibleData.data)) {
          setCollectibleCategories(collectibleData.data);
        }
        
        if (artisanData.data && Array.isArray(artisanData.data)) {
          setArtisanCategories(artisanData.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCollectibleCategories([]);
        setArtisanCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        {/* Hero */}
        <section className="relative">
          <div className="hero-banner-bg flex min-h-[60vh] lg:min-h-[80vh] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4 text-center">
            <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tighter max-w-4xl">
              Discover Unique Collectibles & Artisan Products
            </h1>
            <p className="text-white text-lg md:text-xl font-normal max-w-2xl">
              Explore a curated selection of handcrafted items and rare collectibles from local artisans.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              <a href="#" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transform hover:scale-105 transition-all">
                <span className="truncate">Shop Now</span>
              </a>
              <Link to="/become-seller" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transform hover:scale-105 transition-all">
                <span className="truncate">Become a seller</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-4 md:px-10 lg:px-20">
          <FeaturedProducts />
        </section>

        {/* Categories */}
        <section className="bg-stone-50 py-16 px-4 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 px-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 mb-3 sm:mb-4">
                Explore Our Categories
              </h2>
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
                Discover collectibles across diverse categories, each curated by passionate artisans and collectors
              </p>
            </div>

            {/* Category Navigation Tabs */}
            <div className="border-b border-[#e6e0db] mb-8">
              <div className="flex justify-center gap-8">
                <button 
                  onClick={() => setActiveTab('collectibles')}
                  className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-colors ${
                    activeTab === 'collectibles' 
                      ? 'border-b-[var(--primary-color)] text-[var(--text-primary)]' 
                      : 'border-b-transparent text-[var(--text-secondary)] hover:border-b-[var(--primary-color)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <p className="text-base font-bold">Collectibles</p>
                </button>
                <button 
                  onClick={() => setActiveTab('artisan')}
                  className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-colors ${
                    activeTab === 'artisan' 
                      ? 'border-b-[var(--primary-color)] text-[var(--text-primary)]' 
                      : 'border-b-transparent text-[var(--text-secondary)] hover:border-b-[var(--primary-color)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <p className="text-base font-bold">Artisan Products</p>
                </button>
              </div>
            </div>

            {/* CategoryGrid Implementation */}
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <span className="ml-3 text-stone-600">
                  Loading {activeTab === 'collectibles' ? 'collectible' : 'artisan'} categories...
                </span>
              </div>
            ) : (
              <>
                <CategoryGrid
                  categories={activeTab === 'collectibles' ? collectibleCategories : artisanCategories}
                  selectedCategory={null}
                  onCategorySelect={(categoryName) => {
                    // Navigate to appropriate page based on active tab
                    const baseUrl = activeTab === 'collectibles' ? '/collectibles' : '/artisans';
                    window.location.href = `${baseUrl}?category=${encodeURIComponent(categoryName)}`;
                  }}
                  visibleCount={8}
                  className="mb-8"
                />
              </>
            )}
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

        {/* Become a CraftCurio Artisan */}
        <section className="bg-[var(--secondary-color)] py-20 px-4 md:px-10 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">Become a CraftCurio Artisan</h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">Share your passion with the world. Join our community of talented artisans and start selling your creations today.</p>
            <Link to="/become-seller" className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-full h-12 px-8 mt-8 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all mx-auto">
              <span className="truncate">Join as an Artisan</span>
            </Link>
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

        {/* More to Explore */}
        <section className="bg-stone-50 py-16 px-4 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-12 text-center">More to Explore</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <a href="#" className="group">
                <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <span className="material-symbols-outlined text-4xl text-[var(--primary-color)]">auto_stories</span>
                  <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">Read Artisan Stories</h3>
                </div>
              </a>
              <a href="#" className="group">
                <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <span className="material-symbols-outlined text-4xl text-[var(--primary-color)]">mail</span>
                  <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">Join Our Newsletter</h3>
                </div>
              </a>
              <a href="#" className="group">
                <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <span className="material-symbols-outlined text-4xl text-[var(--primary-color)]">inventory_2</span>
                  <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">Shop Limited Edition</h3>
                </div>
              </a>
              <a href="#" className="group">
                <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <span className="material-symbols-outlined text-4xl text-[var(--primary-color)]">support_agent</span>
                  <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">Custom Orders</h3>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function CardItem({ title, subtitle, image, imageClass, price }) {
  return (
    <div className="group flex h-full flex-col gap-4 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl bg-white">
      <div className="relative w-full aspect-square">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to a placeholder or hide the image on error
              e.target.style.display = 'none';
            }}
          />
        ) : imageClass ? (
          <div className={`${imageClass} absolute inset-0 bg-center bg-no-repeat bg-cover rounded-t-lg transform group-hover:scale-105 transition-transform duration-300`} />
        ) : (
          <div className="absolute inset-0 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-[var(--text-primary)] text-lg font-semibold truncate">{title}</p>
        <p className="text-[var(--text-secondary)] text-sm mb-2 h-10 overflow-hidden">{subtitle}</p>
        {price && (
          <p className="text-[var(--primary-color)] text-lg font-bold">{price}</p>
        )}
      </div>
    </div>
  );
}

function FeaturedProducts() {
  const [api, setApi] = useState(null)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  useCarouselControls(api)

  // Fetch featured products from both collectibles and artisan products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const [collectiblesRes, artisanProductsRes] = await Promise.all([
          fetch('http://localhost:3000/api/collectibles/featured'),
          fetch('http://localhost:3000/api/artisan-products/featured')
        ]);

        const collectiblesData = await collectiblesRes.json();
        const artisanProductsData = await artisanProductsRes.json();

        // Combine and format the products
        const combinedProducts = [];
        
        // Add collectibles (limit to 4)
        if (collectiblesData.data && Array.isArray(collectiblesData.data)) {
          const collectibles = collectiblesData.data.slice(0, 4).map(item => ({
            id: item._id || `collectible-${Date.now()}-${Math.random()}`,
            title: item.title || 'Untitled Collectible',
            subtitle: item.description || 'No description available',
            image: item.image,
            price: item.price || 'Price on request',
            type: 'collectible'
          }));
          combinedProducts.push(...collectibles);
        }

        // Add artisan products (limit to 4)
        if (artisanProductsData.data && Array.isArray(artisanProductsData.data)) {
          const artisanProducts = artisanProductsData.data.slice(0, 4).map(item => ({
            id: item._id || `artisan-${Date.now()}-${Math.random()}`,
            title: item.title || 'Untitled Artisan Product',
            subtitle: item.description || 'No description available',
            image: item.image, // This comes from the backend transformation
            price: item.price ? `₹${item.price}` : 'Price on request',
            type: 'artisan-product'
          }));
          combinedProducts.push(...artisanProducts);
        }

        // Shuffle and limit to 8 products max
        let finalProducts = combinedProducts.sort(() => 0.5 - Math.random()).slice(0, 8);
        
        // If no products from API, use fallback products
        if (finalProducts.length === 0) {
          finalProducts = [
            { 
              id: 'fallback-1', 
              title: 'Ceramic Vase', 
              subtitle: 'Handcrafted ceramic vase with unique glaze', 
              imageClass: 'card-image-ceramic-vase-bg',
              price: '₹2,999',
              type: 'fallback' 
            },
            { 
              id: 'fallback-2', 
              title: 'Vintage Pocket Watch', 
              subtitle: 'Vintage pocket watch with intricate detailing', 
              imageClass: 'card-image-pocket-watch-bg',
              price: '₹15,999',
              type: 'fallback' 
            },
            { 
              id: 'fallback-3', 
              title: 'Silk Scarf', 
              subtitle: 'Hand-painted silk scarf with floral design', 
              imageClass: 'card-image-silk-scarf-bg',
              price: '₹4,499',
              type: 'fallback' 
            },
            { 
              id: 'fallback-4', 
              title: 'Wooden Bird Sculpture', 
              subtitle: 'Hand-carved wooden sculpture of a bird', 
              imageClass: 'card-image-bird-sculpture-bg',
              price: '₹6,999',
              type: 'fallback' 
            }
          ];
        }
        
        setProducts(finalProducts);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        // Fallback to empty array on error
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

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
        {productsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <span className="ml-3 text-stone-600">Loading featured products...</span>
          </div>
        ) : products.length > 0 ? (
          <>
            <Carousel setApi={setApi} className="w-full" opts={{ align: 'start', loop: true, slidesToScroll: 1 }}>
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2">
                  <CardItem 
                    title={product.title} 
                    subtitle={product.subtitle} 
                    image={product.image}
                    price={product.price}
                  />
                </CarouselItem>
              ))}
            </Carousel>
            <CarouselPrevious onClick={handlePrev} />
            <CarouselNext onClick={handleNext} />
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-stone-600">No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
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
