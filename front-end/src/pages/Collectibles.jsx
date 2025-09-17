import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Navbar from '@/components/Navbar';

// Memoized collectible item component for performance
const CollectibleItem = memo(({ item }) => (
  <div className="flex flex-col gap-2 group">
    <div className="relative overflow-hidden rounded-lg">
      <div 
        className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url("${item.image}")` }}
        loading="lazy"
      ></div>
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button 
          className="bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          aria-label={`Add ${item.title} to cart`}
        >
          <span className="material-symbols-outlined text-stone-800">shopping_cart</span>
        </button>
        <button 
          className="bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          aria-label={`View details for ${item.title}`}
        >
          <span className="material-symbols-outlined text-stone-800">visibility</span>
        </button>
      </div>
    </div>
    <div className="px-1">
      <p className="text-stone-800 text-sm font-semibold leading-normal truncate">{item.title}</p>
      <p className="text-[var(--primary-color)] text-sm font-bold leading-normal">{item.price}</p>
    </div>
  </div>
));

CollectibleItem.displayName = 'CollectibleItem';

const Collectibles = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open for better UX

  // Memoized collectibles data for performance
  const collectibles = useMemo(() => [
    {
      id: 1,
      title: "Vintage Pocket Watch",
      price: "$150.00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjbfMKuJG-aPLpKmcLGN83KvaA8NqyC4IuOmXet1x57aZvwz4ly1rXgIOKJFWca9w2gwKlEaLZAIlteb-JYbjJeJyE5p2jJmrZdafOf_bYHC9r1TJYYZ6dk_qo9o2EzAZF2rZQIBJneUFZzDtsWlZG-yjnWhRmOth8D3NC8hkD-6iEaKMYHa-xPT_qYckdXULqtiJPByWNDrYyYMUYed3pCXdzOUhsOQqR99zK0Bb11_vaWBmW0B_cCHcob5rd4hn6Q6_4jllrxYDw"
    },
    {
      id: 2,
      title: "Antique Map of Paris",
      price: "$200.00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7ftPdZwxZWx1Qvni8ZPgvBi--Oqhqlj0IzjOl_Xx7UwpWWmYBIUz90lFI1eIGOOd0J6hd7-plV0-_22EkOY_euIzS6MLHyMPj_0-Gubhr_Zt1d6flgNNE_u1o2d3sEab0huzH3NcrnhgzW7Atq-TCTgi-lO1mKCi36jjo2xIFNGwFvreTzI07bH7DOwPJxm_IPggkDzPZIbFx5ol55fumAjUrVkMn1MX1P-5VvIaF7-gNirCMLTzUuRME3xejiw9hiVdVjvjHdrZF"
    },
    {
      id: 3,
      title: "Rare Coin Collection",
      price: "$300.00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYG0OgQjsvDaGJoH3azOXn7rJdKTyVh0lnD8BFbsnieJiwdTxZhxpPxYrQSFLglHA8B83Liw0-Pm1ZwL2nx8ur63wFU0KeeM1iKQ6wP0Lj5a7J7jgv1fTKsiG7ks8Yv-u1SzVHsxdtdJCfwOCmHsZ7keZPk7OKaul6smVDyW6tvXFtT3Fk0ZFVapqbyBclSZKcIonrIShQE8DAE7P2JeSJ9fzFW_3J2kqqkomr926cwUtQ8wW54KPcth5AcgQQ4sDK-gnImKhNKHumv"
    },
    {
      id: 4,
      title: "Hand-Painted Porcelain Doll",
      price: "$100.00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVkns8on6pgVR8FeDGFv9WPONnILWYkNkQHynNWlafiOMgeqBnMsoKczk6z6hVtHVsuV5y8u-1BgBkDLfuB1DilaRm3533Fy4aAvlLgqW_NQzlHDzQ2M81gK8WVsh0kfGTkoFNIBkYpyuvA8WihzjMX5NKeoqJnMkO_87JfS0GMChJIHAc4T0RZn9eQT7Zr51JTTvYr8hDnVad0FpG3JaTWcm2BtPMnKF53oLtM0crFYfxFwzWpsyXufd6-hbAKfQM9Ei5HPzhMco_"
    },
    {
      id: 5,
      title: "Limited Edition Comic Book",
      price: "$75.00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbjP30kR2tw7q4JxxpQ9s6DeGi6-w-m-eZeP7UpkOxhuijWsP0WtGJ4B8d4Yx0i_k18TABoH7EvFMd__oAkw_3-d6l_x_E3YlmtMvwzhHnaSMPimxr3TCjOBAKUwFKq-UJzClMVjfo9RgISAQVbR4dOVex2INl5FM5utO8ICK0TH2P1JNCh8p2Rpn-pB0JUQCcQoZac2pvJM0cb_a_1eBNuqXlyO8NSWaQSkDMs1y0hKR4x8ujOuxGDW9e7o6D3QZaE1qRMvLSLQXR"
    },
    {
      id: 6,
      title: "Signed First Edition Novel",
      price: "$250.00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALz8qGjwn2HbMVVk1NzrBao_ODszNlR3mbPd9V_AddxsjMLdJhQSyRV0890B-TQRx0gFk9NhObT2ZkdrTN7k3JlR8faIwAw6qqXkjh4xWXxjz5UZB-eGk0Kntr909q_daKv7SvsWxgqY3WaMMEcBKsfuc0d1dnMGzEgP77Dz66UgrZ6KXswCFmmqlCSKZDJrKuVCNy1jB_u0AT00z_fDeIW0Xk03EMSbRva56LiWj7Uba1JN9lVMEAwj99C3-3hddjjZHoy4Hv2qqa"
    }
  ], []);

  const categories = useMemo(() => [
    "Fine Art",
    "Rare Coins & Currency",
    "Trading Cards",
    "Vintage Watches & Jewelry",
    "Comic Books",
    "Stamps",
    "Antiques",
    "Pop Culture Memorabilia",
    "Vintage Toys & Games",
    "Limited-Edition Fashion",
    "Posters & Prints",
    "Digital Collectibles"
  ], []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // On mobile, close sidebar when resizing to desktop
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setSidebarOpen(true); // Keep open on tablet
      } else if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Keep open on desktop
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    // Initialize sidebar state based on screen size
    if (window.innerWidth < 768) {
      setSidebarOpen(false); // Closed on mobile by default
    } else {
      setSidebarOpen(true); // Open on tablet and desktop by default
    }

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array for stable effect

  return (
    <div className="bg-stone-50 min-h-screen">
      <Navbar />
      
      <main className="flex-1 flex pt-20">
        {/* Mobile backdrop overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-[5] md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Sidebar */}
        <aside 
          className={`${sidebarOpen ? 'w-64' : 'w-0 md:w-12'} bg-gradient-to-br from-stone-50 to-stone-100 border-r border-stone-200 shrink-0 absolute md:relative inset-y-0 left-0 z-10 md:z-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0 p-6' : '-translate-x-full md:translate-x-0 p-0 md:p-2'
          }`}
        >
          {sidebarOpen ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-stone-900 text-lg font-bold tracking-tight">Categories</h3>
                <div className="flex gap-2">
                  <button 
                    className="hidden md:block text-stone-600 hover:text-stone-900 transition-colors p-1 rounded-md hover:bg-stone-200/50"
                    onClick={toggleSidebar}
                    title="Hide sidebar"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <button 
                    className="md:hidden text-stone-600 hover:text-stone-900 transition-colors p-1 rounded-md hover:bg-stone-200/50"
                    onClick={toggleSidebar}
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              <nav className="flex flex-col gap-1.5">
                {categories.map((category, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className={`text-stone-700 hover:bg-stone-200/50 hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors px-3 py-2 rounded-lg ${
                      index === categories.length - 1 ? 'border-t border-stone-200 mt-2 pt-3' : ''
                    }`}
                  >
                    {category}
                  </a>
                ))}
              </nav>
            </>
          ) : (
            <div className="flex flex-col items-center pt-4">
              <button 
                className="text-stone-600 hover:text-stone-900 transition-colors p-2 rounded-md hover:bg-stone-200/50 mb-4"
                onClick={toggleSidebar}
                title="Show sidebar"
              >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
              <div className="flex flex-col gap-2">
                {categories.slice(0, 3).map((category, index) => (
                  <div 
                    key={index}
                    className="w-2 h-2 bg-stone-400 rounded-full"
                    title={category}
                  ></div>
                ))}
                <div className="w-2 h-2 bg-stone-300 rounded-full" title="More categories"></div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1 px-8 py-6 lg:px-16 xl:px-24">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <button 
                className="p-2 rounded-md hover:bg-stone-100 text-stone-600 transition-colors md:hidden"
                onClick={toggleSidebar}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              {!sidebarOpen && (
                <button 
                  className="hidden md:block p-2 rounded-md hover:bg-stone-100 text-stone-600 transition-colors"
                  onClick={toggleSidebar}
                  title="Show categories"
                >
                  <span className="material-symbols-outlined">menu</span>
                </button>
              )}
              <div className="flex flex-col gap-1.5">
                <h1 className="text-stone-900 text-2xl font-bold leading-tight tracking-tight">Collectibles</h1>
                <p className="text-stone-500 text-sm italic">Discover unique and rare collectibles from local artisans.</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <div className="flex-1">
                <div className="flex w-full items-stretch rounded-md h-10 border border-stone-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[var(--primary-color)] focus-within:border-[var(--primary-color)]">
                  <div className="text-stone-500 flex items-center justify-center pl-3 border-r border-stone-300">
                    <span className="material-symbols-outlined text-xl">search</span>
                  </div>
                  <input 
                    className="flex-1 px-3 text-stone-900 bg-transparent placeholder:text-stone-500 text-sm font-normal leading-normal focus:outline-none" 
                    placeholder="Search for collectibles..." 
                    defaultValue=""
                    aria-label="Search for collectibles"
                  />
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-1.5 rounded-md bg-white border border-stone-300 px-3 hover:bg-stone-100 transition-colors">
                  <p className="text-stone-700 text-sm font-medium leading-normal">Price Range</p>
                  <span className="material-symbols-outlined text-stone-500 text-base">expand_more</span>
                </button>
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-1.5 rounded-md bg-white border border-stone-300 px-3 hover:bg-stone-100 transition-colors">
                  <p className="text-stone-700 text-sm font-medium leading-normal">Rarity</p>
                  <span className="material-symbols-outlined text-stone-500 text-base">expand_more</span>
                </button>
              </div>
            </div>

            {/* Collectibles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {collectibles.map((item) => (
                <CollectibleItem key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center mt-6">
              <nav aria-label="Pagination" className="flex items-center gap-1.5">
                <button className="flex items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 disabled:text-stone-300 disabled:hover:bg-transparent h-8 w-8 transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button className="flex items-center justify-center rounded-md font-medium text-white bg-[var(--primary-color)] h-8 w-8 text-xs transition-colors">1</button>
                <button className="flex items-center justify-center rounded-md font-medium text-stone-600 hover:bg-stone-100 h-8 w-8 text-xs transition-colors">2</button>
                <button className="flex items-center justify-center rounded-md font-medium text-stone-600 hover:bg-stone-100 h-8 w-8 text-xs transition-colors">3</button>
                <span className="text-stone-400 text-xs">...</span>
                <button className="flex items-center justify-center rounded-md font-medium text-stone-600 hover:bg-stone-100 h-8 w-8 text-xs transition-colors">10</button>
                <button className="flex items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 h-8 w-8 transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Collectibles;
