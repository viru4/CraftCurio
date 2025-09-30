// This file is now deprecated - all data is fetched from database APIs
// Categories are fetched from: GET /api/categories?type=collectible
// Items are fetched from: GET /api/collectibles

console.warn('⚠️  Products.jsx is deprecated. All data is now fetched from database APIs.');

// Export empty arrays to prevent import errors during transition
export const categories = [];
export const collectibleItems = [];

// Utility functions now use database data via API calls
export const getItemsByCategory = () => [];
export const getFeaturedItems = () => [];
export const getPopularItems = () => [];
export const getRecentItems = () => [];
export const getItemById = () => null;
export const getAllItems = () => [];
export const searchItems = () => [];
export const getDefaultCarouselItems = () => [];
export const getRandomCarouselItems = () => [];
    description: "Retro clothing, hats, sneakers, handbags, and accessories from past decades."
  },
  {
    name: "Mid-Century Modern",
    description: "Furniture, decor, and collectibles from the mid-1900s design era."
  },
  {
    name: "Scientific Instruments",
    description: "Barometers, fossils, minerals, shells, antique microscopes, and vintage medical tools."
  },
  {
    name: "Ephemera",
    description: "Vintage postcards, matchbooks, brochures, business cards, personal letters, and promotional items."
  },
  {
    name: "Sports Memorabilia",
    description: "Signed jerseys, vintage baseballs, trading cards from hockey, football, basketball."
  },
  {
    name: "Music Collectibles",
    description: "Vintage guitars, records, music boxes, original concert posters."
  },
  {
    name: "Antiques and Vintage Items",
    description: "Furniture, porcelain, glassware, clocks, rugs, household silverware."
  },
  {
    name: "Digital Collectibles",
    description: "NFTs representing digital art, music, and virtual goods."
  },
  {
    name: "Automotive Collectibles",
    description: "Model trains, vintage bicycles, classic cars memorabilia."
  },
  {
    name: "Home Collectibles",
    description: "Decorative items like porcelain figurines, candles, and garden statues."
  }
];

// Collectible items data
export const collectibleItems = [
  {
    id: 1,
    title: "1965 Morgan Silver Dollar",
    description: "Pristine condition Morgan Silver Dollar from 1965, certified authentic.",
    price: "$125.00",
    category: "Coins, Currency, and Stamps",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 2,
    title: "Amazing Spider-Man #1 Reprint",
    description: "High-quality reprint of the iconic first Amazing Spider-Man comic book.",
    price: "$89.99",
    category: "Books and Periodicals",
    image: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400&h=300&fit=crop",
    featured: false,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 3,
    title: "Vintage Star Wars Luke Skywalker",
    description: "Original 1977 Luke Skywalker action figure in mint condition with packaging.",
    price: "$299.00",
    category: "Action Figures and Toys",
    image: "https://images.unsplash.com/photo-1606041011872-596597976b25?w=400&h=300&fit=crop",
    featured: false,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 4,
    title: "Jaws Movie Poster (1975)",
    description: "Original theatrical release poster from Steven Spielberg's classic thriller.",
    price: "$450.00",
    category: "Pop Culture Memorabilia",
    image: "https://images.unsplash.com/photo-1489599511086-4d1b81c8d46b?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 5,
    title: "1960s Mod Mini Dress",
    description: "Authentic 1960s mod-style mini dress in excellent vintage condition.",
    price: "$185.00",
    category: "Vintage Fashion",
    image: "https://images.unsplash.com/photo-1566479179817-ff8dc4ce9c47?w=400&h=300&fit=crop",
    featured: false,
    popular: true,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 6,
    title: "Eames Lounge Chair Replica",
    description: "High-quality replica of the iconic mid-century modern Eames lounge chair.",
    price: "$1,299.00",
    category: "Mid-Century Modern",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 7,
    title: "Antique Brass Microscope",
    description: "Victorian-era brass microscope in working condition with original wooden case.",
    price: "$675.00",
    category: "Scientific Instruments",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 8,
    title: "1950s Travel Postcards Set",
    description: "Collection of 25 vintage travel postcards from various American destinations.",
    price: "$35.00",
    category: "Ephemera",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    featured: false,
    popular: true,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 9,
    title: "Signed Baseball - Derek Jeter",
    description: "Official MLB baseball signed by Yankees legend Derek Jeter with certificate.",
    price: "$399.00",
    category: "Sports Memorabilia",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop",
    featured: false,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 10,
    title: "1970s Gibson Les Paul",
    description: "Vintage 1975 Gibson Les Paul electric guitar in sunburst finish.",
    price: "$3,200.00",
    category: "Music Collectibles",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 11,
    title: "Victorian Porcelain Tea Set",
    description: "Complete 19th-century porcelain tea set with hand-painted floral design.",
    price: "$285.00",
    category: "Antiques and Vintage Items",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 12,
    title: "Digital Art NFT Collection",
    description: "Exclusive digital art NFT featuring abstract geometric patterns.",
    price: "$0.25 ETH",
    category: "Digital Collectibles",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 13,
    title: "1969 Camaro SS Model Car",
    description: "Die-cast 1:18 scale model of the iconic 1969 Chevrolet Camaro SS in pristine condition.",
    price: "$145.00",
    category: "Automotive Collectibles",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    featured: false,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 14,
    title: "Art Deco Silver Candelabra",
    description: "Stunning 1920s Art Deco silver-plated candelabra with geometric design.",
    price: "$380.00",
    category: "Home Collectibles",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 15,
    title: "Superman #75 Comic Book",
    description: "Death of Superman issue from 1992, featuring black polybag and memorial armband.",
    price: "$65.00",
    category: "Books and Periodicals",
    image: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400&h=300&fit=crop",
    featured: false,
    popular: true,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 16,
    title: "Vintage Rolex Submariner Watch",
    description: "1970s Rolex Submariner in excellent condition with original box and papers.",
    price: "$8,500.00",
    category: "Vintage Fashion",
    image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=300&fit=crop",
    featured: false,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 17,
    title: "Funko Pop Batman Collection",
    description: "Complete set of 6 Batman Funko Pop figures including rare chase variants.",
    price: "$189.99",
    category: "Action Figures and Toys",
    image: "https://images.unsplash.com/photo-1606041011872-596597976b25?w=400&h=300&fit=crop",
    featured: false,
    popular: true,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 18,
    title: "Civil War Era Compass",
    description: "Authentic brass pocket compass from the American Civil War period with leather case.",
    price: "$525.00",
    category: "Scientific Instruments",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 19,
    title: "Marilyn Monroe Autograph",
    description: "Rare authentic autographed photograph of Marilyn Monroe with certificate of authenticity.",
    price: "$2,750.00",
    category: "Pop Culture Memorabilia",
    image: "https://images.unsplash.com/photo-1489599511086-4d1b81c8d46b?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 20,
    title: "1936 Olympic Games Poster",
    description: "Original poster from the 1936 Berlin Olympics, professionally framed and authenticated.",
    price: "$1,200.00",
    category: "Ephemera",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    featured: false,
    popular: false,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 21,
    title: "Audemars Piguet Royal Oak 34mm Silver Dial Watch",
    description: "Luxury Swiss watch with distinct octagonal bezel and timeless design. Highly sought-after by watch collectors for its blend of elegance and engineering. A statement piece among timepiece enthusiasts.",
    price: "$30,451.00",
    category: "Vintage Fashion",
    image: "/src/assets/CollectiblesItemsData/Audemars Piguet Royal Oak 34mm Silver Dial Watch.png",
    featured: true,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 22,
    title: "Rolex Yacht-Master 42mm Black Dial",
    description: "Rolex's Yacht-Master series celebrated for combining functionality and style. The 42mm version in black is a modern classic that appeals to investment-minded collectors and luxury aficionados.",
    price: "$31,680.00",
    category: "Vintage Fashion",
    image: "/src/assets/CollectiblesItemsData/Rolex Yacht-Master 42mm Black Dial.png",
    featured: true,
    popular: true,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 23,
    title: "Subodh Gupta Sculpture \"Gober Ganesha\"",
    description: "Contemporary art piece by renowned Indian artist Subodh Gupta, prized for its cultural symbolism and unique materials. Gupta's works regularly feature in high-profile exhibitions and auctions.",
    price: "$40,000.00",
    category: "Antiques and Vintage Items",
    image: "/src/assets/CollectiblesItemsData/Subodh Gupta Sculpture \"Gober Ganesha\".png",
    featured: true,
    popular: false,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 24,
    title: "Patek Philippe Calatrava 40mm Black Dial Watch",
    description: "Iconic luxury watchmaking at its finest. The Calatrava series is revered for its simplicity and elegance. The 40mm version with black dial is amongst the most collectible vintage watches.",
    price: "$33,000.00",
    category: "Vintage Fashion",
    image: "/src/assets/CollectiblesItemsData/Patek Philippe Calatrava 40mm Black Dial Watch.png",
    featured: true,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 25,
    title: "Vintage Oil Painting in Ornate Frame",
    description: "19th and early 20th-century oil painting with luxurious original frame and clear documentation of creator and history. Large signed piece with provenance perfect for serious collectors.",
    price: "$35,000.00",
    category: "Antiques and Vintage Items",
    image: "/src/assets/CollectiblesItemsData/Vintage Paintings (Oil Paintings in Ornate Frames).png",
    featured: true,
    popular: false,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 26,
    title: "British Guiana 1c Magenta Stamp",
    description: "The world's rarest and most valuable stamp dating from 1856, famed for its single surviving specimen. It has a magenta background and was used in British Guiana (now Guyana). A true collector's gem, breaking world records for stamp auctions.",
    price: "$9,480,000.00",
    category: "Coins, Currency, and Stamps",
    image: "/src/assets/CollectiblesItemsData/(Enhanced)_British_Guiana_1856_1c_magenta_stamp.png",
    featured: true,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 27,
    title: "1909 T206 Honus Wagner Baseball Card",
    description: "Considered the 'Holy Grail' of sports cards, featuring legendary player Honus Wagner. Highly sought-after for its rarity due to limited production. Its scarcity and connection to baseball history make it the most prized trading card.",
    price: "$7,250,000.00",
    category: "Sports Memorabilia",
    image: "/src/assets/CollectiblesItemsData/1909_T206_Honus_Wagner_Baseball_Card_with_PSA_grade_EX_5-MC.png",
    featured: true,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 28,
    title: "Pinner Qing Dynasty Vase",
    description: "An 18th-century Chinese porcelain vase adorned with intricate floral designs and vibrant colors, discovered in a modest home in London. Exceptional craftsmanship and historical significance from the Qing Dynasty.",
    price: "$80,200,000.00",
    category: "Antiques and Vintage Items",
    image: "/src/assets/CollectiblesItemsData/Pinner-Qing-Dynasty-Vase.png",
    featured: true,
    popular: true,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 29,
    title: "Badminton Cabinet",
    description: "An opulent 18th-century Florentine cabinet, over 12 feet tall and featuring elaborate inlays of semi-precious stones. Its grandeur and artistry make it one of the most expensive furniture pieces ever sold.",
    price: "$36,000,000.00",
    category: "Antiques and Vintage Items",
    image: "/src/assets/CollectiblesItemsData/Badminton Cabinet.png",
    featured: true,
    popular: false,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 30,
    title: "1933 Saint-Gaudens Double Eagle Gold Coin",
    description: "The only legal-to-own coin of its kind, survived the gold recall in the Great Depression. Considered the most valuable coin. Symbolizes historic monetary events and coin collecting prestige.",
    price: "$18,900,000.00",
    category: "Coins, Currency, and Stamps",
    image: "/src/assets/CollectiblesItemsData/1933-saint-gaudens-gold-double-eagle.png",
    featured: true,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 31,
    title: "Once Upon a Time in Shaolin (Wu-Tang Clan)",
    description: "A one-of-a-kind music album produced by the Wu-Tang Clan, with only one copy ever released. Comes in a custom silver-and-nickel box. Shrouded in exclusivity and subject to strict usage agreements.",
    price: "$2,000,000.00",
    category: "Music Collectibles",
    image: "/src/assets/CollectiblesItemsData/once-upon-a-time-in-shaolin.png",
    featured: true,
    popular: true,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 32,
    title: "Super Mario Bros. (NES, Sealed Copy)",
    description: "Early run, unopened copy of Nintendo's original game, preserved for decades. Gaming history landmark and prized among video game collectors. A true piece of gaming nostalgia.",
    price: "$2,000,000.00",
    category: "Action Figures and Toys",
    image: "/src/assets/CollectiblesItemsData/sealed-nes-super-mario-bros-canadian-version-v0-fr940qbgil1c1.png",
    featured: true,
    popular: true,
    recent: false,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  },
  {
    id: 33,
    title: "Apollo 11 Lunar Sample Bag",
    description: "Used by astronauts on the Apollo 11 mission to collect moon dust. Unique piece of space exploration history. An extraordinary artifact from humanity's first moon landing mission.",
    price: "$1,800,000.00",
    category: "Scientific Instruments",
    image: "/src/assets/CollectiblesItemsData/Apollo 11 Lunar Sample Bag.png",
    featured: true,
    popular: false,
    recent: true,
    // Carousel-ready format
    targetSection: 'filtered-items-section',
    buttonText: 'Explore Collection'
  }
];

// Utility functions for filtering items
export const getItemsByCategory = (category) => {
  return collectibleItems.filter(item => item.category === category);
};

export const getFeaturedItems = () => {
  return collectibleItems.filter(item => item.featured);
};

export const getPopularItems = () => {
  return collectibleItems.filter(item => item.popular);
};

export const getRecentItems = () => {
  return collectibleItems.filter(item => item.recent);
};

export const getItemById = (id) => {
  return collectibleItems.find(item => item.id === id);
};

export const getAllItems = () => {
  return collectibleItems;
};

export const searchItems = (query) => {
  const searchTerm = query.toLowerCase();
  return collectibleItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm)
  );
};

// Generate default carousel items (Featured, Popular, Recent)
export const getDefaultCarouselItems = () => {
  const featuredItem = getFeaturedItems()[0] || collectibleItems[0];
  const popularItem = getPopularItems()[0] || collectibleItems[1];
  const recentItem = getRecentItems()[0] || collectibleItems[2];

  return [
    {
      ...featuredItem,
      id: `carousel-featured-${featuredItem.id}`,
      title: 'Featured Collectibles',
      description: 'Handpicked rare finds from our curated collection'
    },
    {
      ...popularItem,
      id: `carousel-popular-${popularItem.id}`,
      title: 'Popular Items',
      description: 'Most loved pieces by our community'
    },
    {
      ...recentItem,
      id: `carousel-recent-${recentItem.id}`,
      title: 'Recent Items',
      description: 'Fresh arrivals from talented artisans'
    }
  ];
};

// Generate random carousel items from different categories
export const getRandomCarouselItems = (count = 3) => {
  // Get unique categories that have items
  const categoriesWithItems = [...new Set(collectibleItems.map(item => item.category))];
  
  // Shuffle categories and take the first 'count' number
  const shuffledCategories = categoriesWithItems.sort(() => Math.random() - 0.5).slice(0, count);
  
  return shuffledCategories.map((category, index) => {
    // Get items from this category
    const categoryItems = collectibleItems.filter(item => item.category === category);
    
    // Pick a random item from this category
    const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
    
    // Since all items now have consistent format, we can directly use them
    return {
      ...randomItem,
      id: `carousel-${index}-${randomItem.id}`,
      title: `${category} Collection`,
      description: `Discover ${randomItem.title} and more amazing ${category.toLowerCase()} items`
    };
  });
};
