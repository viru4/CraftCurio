import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ArtisanProductCategory from '../src/models/ArtisanProductCategory.js';
import ArtisanProduct from '../src/models/ArisanProduct.js';
import CollectibleCategory from '../src/models/collectiblecategory.js';
import Collectible from '../src/models/Collectible.js';

// Get current directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Fallback data in case file reading fails
const getDefaultData = () => {
  const categories = [];  // Not used anymore

  const collectibleItems = [
    {
      title: "1965 Morgan Silver Dollar",
      description: "Pristine condition Morgan Silver Dollar from 1965, certified authentic.",
      price: "₹9,999",
      category: "Coins",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop",
      featured: false,
      popular: false,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Amazing Spider-Man #1 Reprint",
      description: "High-quality reprint of the iconic first Amazing Spider-Man comic book.",
      price: "₹7,499",
      category: "Comic Books",
      image: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400&h=300&fit=crop",
      featured: false,
      popular: true,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Vintage Star Wars Luke Skywalker",
      description: "Original 1977 Luke Skywalker action figure in mint condition with packaging.",
      price: "₹24,999",
      category: "Vintage Toys",
      image: "https://images.unsplash.com/photo-1606041011872-596597976b25?w=400&h=300&fit=crop",
      featured: false,
      popular: true,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Jaws Movie Poster (1975)",
      description: "Original theatrical release poster from Steven Spielberg's classic thriller.",
      price: "₹37,499",
      category: "Movie Posters",
      image: "https://images.unsplash.com/photo-1489599511086-4d1b81c8d46b?w=400&h=300&fit=crop",
      featured: false,
      popular: false,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Signed Baseball - Derek Jeter",
      description: "Official MLB baseball signed by Yankees legend Derek Jeter with certificate.",
      price: "₹33,249",
      category: "Sports Memorabilia",
      image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop",
      featured: true,
      popular: true,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "British Guiana 1c Magenta Stamp",
      description: "The world's rarest and most valuable stamp dating from 1856, famed for its single surviving specimen.",
      price: "₹79,00,00,000",
      category: "Stamps",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      featured: true,
      popular: true,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "1909 T206 Honus Wagner Baseball Card",
      description: "Considered the 'Holy Grail' of sports cards, featuring legendary player Honus Wagner.",
      price: "₹60,41,66,667",
      category: "Trading Cards",
      image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop",
      featured: true,
      popular: true,
      recent: false,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Vintage Rolex Submariner Watch",
      description: "1970s Rolex Submariner in excellent condition with original box and papers.",
      price: "₹7,08,333",
      category: "Watches and Timepieces",
      image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=300&fit=crop",
      featured: true,
      popular: true,
      recent: true,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Apollo 11 Lunar Sample Bag",
      description: "Used by astronauts on the Apollo 11 mission to collect moon dust. Unique piece of space exploration history.",
      price: "₹15,00,00,000",
      category: "Scientific Instruments",
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop",
      featured: true,
      popular: false,
      recent: true,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    },
    {
      title: "Civil War Era Compass",
      description: "Authentic brass pocket compass from the American Civil War period with leather case.",
      price: "₹43,749",
      category: "Scientific Instruments",
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop",
      featured: false,
      popular: false,
      recent: true,
      targetSection: 'filtered-items-section',
      buttonText: 'Explore Collection'
    }
  ];

  const artisanProducts = [
    {
      id: "artisan-001",
      title: "Handwoven Cotton Saree",
      description: "Beautiful handwoven cotton saree with intricate traditional patterns and natural dyes. Each saree is unique and represents the rich cultural heritage of Indian textile traditions.",
      category: "Handloom Sarees and Textiles",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/handwoven-cotton-saree_1024x1024.jpg"],
      price: 7499,
      currency: "INR",
      rating: { average: 4.8, count: 23 },
      seller: {
        id: "seller-001",
        name: "Priya Textiles",
        verified: true
      },
      craftMethod: "Handwoven using traditional techniques passed down through generations",
      provenance: "Made in Varanasi, India using locally sourced cotton",
      craftingStory: "Each saree takes 3-4 days to complete using traditional handloom techniques. The artisan family has been weaving for over 200 years.",
      availability: true,
      shippingInfo: {
        weight: 800,
        dimensions: { height: 550, width: 110, depth: 2 },
        estimatedDeliveryDays: 7
      },
      tags: ["handwoven", "cotton", "traditional", "saree", "natural-dyes"],
      featured: true,
      popular: true,
      recent: false,
      views: 156,
      likes: 23
    },
    {
      id: "artisan-002",
      title: "Terracotta Pottery Vase",
      description: "Handcrafted terracotta vase with traditional motifs and natural earth tones. Perfect for home decoration or as a unique gift.",
      category: "Terracotta Pottery and Sculpture",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/terracotta-vase_1024x1024.jpg"],
      price: 3750,
      currency: "INR",
      rating: { average: 4.6, count: 18 },
      seller: {
        id: "seller-002",
        name: "Clay Crafts Studio",
        verified: true
      },
      craftMethod: "Hand-thrown pottery with traditional firing techniques",
      provenance: "Made in West Bengal, India using local clay",
      craftingStory: "Each piece is individually crafted by skilled artisans who have mastered the ancient art of terracotta pottery.",
      availability: true,
      shippingInfo: {
        weight: 1200,
        dimensions: { height: 25, width: 20, depth: 20 },
        estimatedDeliveryDays: 10
      },
      tags: ["terracotta", "pottery", "handmade", "traditional", "decorative"],
      featured: false,
      popular: true,
      recent: true,
      views: 89,
      likes: 15
    },
    {
      id: "artisan-003",
      title: "Brass Handmade Jewelry Set",
      description: "Elegant brass jewelry set featuring traditional designs with intricate detailing. Includes necklace, earrings, and bracelet.",
      category: "Brassware and Metal Crafts",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/brass-necklace-set_1024x1024.jpg"],
      price: 10416,
      currency: "INR",
      rating: { average: 4.9, count: 31 },
      seller: {
        id: "seller-003",
        name: "Heritage Jewelry Co.",
        verified: true
      },
      craftMethod: "Hand-crafted using traditional metalworking techniques and lost-wax casting",
      provenance: "Made in Rajasthan, India by master craftsmen",
      craftingStory: "Each piece is meticulously crafted using age-old techniques that have been preserved for centuries.",
      availability: true,
      shippingInfo: {
        weight: 300,
        dimensions: { height: 15, width: 20, depth: 5 },
        estimatedDeliveryDays: 8
      },
      tags: ["brass", "jewelry", "traditional", "handmade", "ethnic"],
      featured: true,
      popular: false,
      recent: false,
      views: 234,
      likes: 42
    },
    {
      id: "artisan-004",
      title: "Hand-carved Wooden Box",
      description: "Exquisite hand-carved wooden box with traditional motifs and smooth finish. Perfect for storing precious items or as a decorative piece.",
      category: "Wooden Furniture",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/wooden-carved-box_1024x1024.jpg"],
      price: 6250,
      currency: "INR",
      rating: { average: 4.7, count: 22 },
      seller: {
        id: "seller-004",
        name: "Wooden Wonders",
        verified: true
      },
      craftMethod: "Hand-carved from premium rosewood using traditional carving tools",
      provenance: "Made in Karnataka, India using sustainably sourced wood",
      craftingStory: "Each box is individually carved by skilled artisans who have inherited the craft from their ancestors.",
      availability: true,
      shippingInfo: {
        weight: 800,
        dimensions: { height: 12, width: 18, depth: 12 },
        estimatedDeliveryDays: 12
      },
      tags: ["wooden", "carved", "traditional", "rosewood", "handcrafted"],
      featured: false,
      popular: true,
      recent: false,
      views: 167,
      likes: 28
    },
    {
      id: "artisan-005",
      title: "Natural Indigo Dye Cotton Cloth",
      description: "Beautiful natural indigo dyed cotton cloth with traditional patterns. Each piece is unique due to the natural dyeing process.",
      category: "Block Printed Fabrics",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/indigo-dye-cotton_1024x1024.jpg"],
      price: 2917,
      currency: "INR",
      rating: { average: 4.5, count: 16 },
      seller: {
        id: "seller-005",
        name: "Natural Dyes Co.",
        verified: true
      },
      craftMethod: "Hand-dyed using natural indigo and traditional dyeing techniques",
      provenance: "Made in Gujarat, India using organic cotton and natural indigo",
      craftingStory: "The indigo dyeing process is an ancient art that creates unique patterns and colors in each piece.",
      availability: true,
      shippingInfo: {
        weight: 200,
        dimensions: { height: 200, width: 150, depth: 1 },
        estimatedDeliveryDays: 6
      },
      tags: ["indigo", "cotton", "natural-dyes", "traditional", "handmade"],
      featured: false,
      popular: false,
      recent: true,
      views: 78,
      likes: 12
    },
    {
      id: "artisan-006",
      title: "Hand-painted Madhubani Art",
      description: "Authentic Madhubani painting on handmade paper featuring traditional motifs and vibrant colors. A true piece of Indian folk art.",
      category: "Madhubani Paintings",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/madhubani-painting_1024x1024.jpg"],
      price: 7916,
      currency: "INR",
      rating: { average: 4.8, count: 27 },
      seller: {
        id: "seller-006",
        name: "Folk Art Gallery",
        verified: true
      },
      craftMethod: "Hand-painted using natural colors and traditional Madhubani techniques",
      provenance: "Made in Bihar, India by certified Madhubani artists",
      craftingStory: "Each painting tells a story and represents the rich cultural heritage of Madhubani art tradition.",
      availability: true,
      shippingInfo: {
        weight: 150,
        dimensions: { height: 30, width: 40, depth: 1 },
        estimatedDeliveryDays: 9
      },
      tags: ["madhubani", "folk-art", "painting", "traditional", "natural-colors"],
      featured: true,
      popular: false,
      recent: false,
      views: 189,
      likes: 35
    },
    {
      id: "artisan-007",
      title: "Bamboo Basket Handmade",
      description: "Beautifully crafted bamboo basket with intricate weaving patterns. Perfect for home organization or decorative purposes.",
      category: "Bamboo and Cane Products",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/bamboo-basket_1024x1024.jpg"],
      price: 2333,
      currency: "INR",
      rating: { average: 4.4, count: 14 },
      seller: {
        id: "seller-007",
        name: "Bamboo Crafts",
        verified: true
      },
      craftMethod: "Hand-woven using traditional bamboo weaving techniques",
      provenance: "Made in Assam, India using locally grown bamboo",
      craftingStory: "Each basket is hand-woven by skilled artisans who have mastered the art of bamboo weaving.",
      availability: true,
      shippingInfo: {
        weight: 500,
        dimensions: { height: 20, width: 25, depth: 20 },
        estimatedDeliveryDays: 7
      },
      tags: ["bamboo", "basket", "handwoven", "eco-friendly", "traditional"],
      featured: false,
      popular: false,
      recent: true,
      views: 67,
      likes: 9
    },
    {
      id: "artisan-008",
      title: "Handmade Wool Shawl",
      description: "Luxurious handmade wool shawl with traditional patterns and soft texture. Perfect for cold weather or as an elegant accessory.",
      category: "Embroidered Shawls",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/wool-shawl_1024x1024.jpg"],
      price: 9999,
      currency: "INR",
      rating: { average: 4.7, count: 25 },
      seller: {
        id: "seller-008",
        name: "Mountain Weavers",
        verified: true
      },
      craftMethod: "Hand-woven using traditional techniques and premium wool",
      provenance: "Made in Himachal Pradesh, India using local sheep wool",
      craftingStory: "Each shawl is woven by skilled artisans who have inherited the craft from generations of weavers.",
      availability: true,
      shippingInfo: {
        weight: 600,
        dimensions: { height: 180, width: 70, depth: 2 },
        estimatedDeliveryDays: 8
      },
      tags: ["wool", "shawl", "handwoven", "traditional", "warm"],
      featured: true,
      popular: true,
      recent: false,
      views: 198,
      likes: 31
    },
    {
      id: "artisan-009",
      title: "Embroidered Leather Wallet",
      description: "Handcrafted leather wallet with intricate embroidery work. Features traditional patterns and premium leather quality.",
      category: "Leathercraft",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/embroidered-wallet_1024x1024.jpg"],
      price: 5416,
      currency: "INR",
      rating: { average: 4.6, count: 19 },
      seller: {
        id: "seller-009",
        name: "Leather Crafts Co.",
        verified: true
      },
      craftMethod: "Hand-stitched leather with traditional embroidery techniques",
      provenance: "Made in Rajasthan, India using premium leather",
      craftingStory: "Each wallet is carefully crafted with attention to detail and traditional craftsmanship.",
      availability: true,
      shippingInfo: {
        weight: 200,
        dimensions: { height: 10, width: 18, depth: 2 },
        estimatedDeliveryDays: 10
      },
      tags: ["leather", "wallet", "embroidered", "handcrafted", "traditional"],
      featured: false,
      popular: true,
      recent: false,
      views: 134,
      likes: 21
    },
    {
      id: "artisan-010",
      title: "Brass Oil Lamp",
      description: "Traditional brass oil lamp with intricate designs and smooth finish. Perfect for decorative purposes or traditional ceremonies.",
      category: "Brassware and Metal Crafts",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/brass-oil-lamp_1024x1024.jpg"],
      price: 4583,
      currency: "INR",
      rating: { average: 4.5, count: 17 },
      seller: {
        id: "seller-010",
        name: "Brass Artisans",
        verified: true
      },
      craftMethod: "Hand-crafted brass with traditional metalworking techniques",
      provenance: "Made in Moradabad, India using premium brass",
      craftingStory: "Each lamp is individually crafted by skilled metalworkers using traditional techniques.",
      availability: true,
      shippingInfo: {
        weight: 400,
        dimensions: { height: 15, width: 12, depth: 12 },
        estimatedDeliveryDays: 9
      },
      tags: ["brass", "oil-lamp", "traditional", "decorative", "metalwork"],
      featured: false,
      popular: false,
      recent: true,
      views: 92,
      likes: 14
    },
    {
      id: "artisan-011",
      title: "Hand-knotted Wool Rug",
      description: "Beautiful hand-knotted wool rug with traditional patterns and vibrant colors. Made using age-old techniques.",
      category: "Handloom Sarees and Textiles",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/wool-rug_1024x1024.jpg"],
      price: 14999,
      currency: "INR",
      rating: { average: 4.9, count: 33 },
      seller: {
        id: "seller-011",
        name: "Rug Masters",
        verified: true
      },
      craftMethod: "Hand-knotted using traditional techniques and premium wool",
      provenance: "Made in Kashmir, India using local sheep wool",
      craftingStory: "Each rug is individually knotted by skilled artisans, taking weeks to complete.",
      availability: true,
      shippingInfo: {
        weight: 2000,
        dimensions: { height: 150, width: 100, depth: 5 },
        estimatedDeliveryDays: 14
      },
      tags: ["wool", "rug", "hand-knotted", "traditional", "kashmir"],
      featured: true,
      popular: true,
      recent: false,
      views: 267,
      likes: 48
    },
    {
      id: "artisan-012",
      title: "Handcrafted Ceramic Tea Set",
      description: "Elegant ceramic tea set with traditional glazing and beautiful patterns. Perfect for tea ceremonies or home decoration.",
      category: "Blue Pottery",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/ceramic-tea-set_1024x1024.jpg"],
      price: 9166,
      currency: "INR",
      rating: { average: 4.7, count: 24 },
      seller: {
        id: "seller-012",
        name: "Ceramic Studio",
        verified: true
      },
      craftMethod: "Hand-thrown ceramic with traditional glazing techniques",
      provenance: "Made in Gujarat, India using local clay and traditional glazes",
      craftingStory: "Each piece is individually crafted and glazed by skilled ceramic artists.",
      availability: true,
      shippingInfo: {
        weight: 1500,
        dimensions: { height: 20, width: 25, depth: 25 },
        estimatedDeliveryDays: 11
      },
      tags: ["ceramic", "tea-set", "handcrafted", "traditional", "glazed"],
      featured: true,
      popular: false,
      recent: false,
      views: 176,
      likes: 29
    },
    {
      id: "artisan-013",
      title: "Beaded Tribal Necklace",
      description: "Stunning tribal necklace with colorful beads and traditional patterns. A unique piece of ethnic jewelry.",
      category: "Tribal Jewelry",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/tribal-necklace_1024x1024.jpg"],
      price: 7083,
      currency: "INR",
      rating: { average: 4.6, count: 20 },
      seller: {
        id: "seller-013",
        name: "Tribal Treasures",
        verified: true
      },
      craftMethod: "Hand-beaded using traditional tribal techniques and natural materials",
      provenance: "Made in Odisha, India by tribal artisans",
      craftingStory: "Each necklace is hand-beaded by tribal artisans using traditional techniques passed down through generations.",
      availability: true,
      shippingInfo: {
        weight: 150,
        dimensions: { height: 25, width: 30, depth: 3 },
        estimatedDeliveryDays: 8
      },
      tags: ["tribal", "necklace", "beaded", "ethnic", "traditional"],
      featured: false,
      popular: true,
      recent: false,
      views: 145,
      likes: 22
    },
    {
      id: "artisan-014",
      title: "Painted Clay Figurines",
      description: "Charming hand-painted clay figurines depicting traditional characters and scenes. Perfect for home decoration.",
      category: "Terracotta Pottery and Sculpture",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/clay-figurines_1024x1024.jpg"],
      price: 3500,
      currency: "INR",
      rating: { average: 4.4, count: 15 },
      seller: {
        id: "seller-014",
        name: "Clay Art Studio",
        verified: true
      },
      craftMethod: "Hand-sculpted clay with traditional painting techniques",
      provenance: "Made in West Bengal, India using local clay",
      craftingStory: "Each figurine is individually sculpted and painted by skilled artisans.",
      availability: true,
      shippingInfo: {
        weight: 300,
        dimensions: { height: 15, width: 10, depth: 8 },
        estimatedDeliveryDays: 7
      },
      tags: ["clay", "figurines", "painted", "traditional", "decorative"],
      featured: false,
      popular: false,
      recent: true,
      views: 73,
      likes: 11
    },
    {
      id: "artisan-015",
      title: "Natural Shea Butter Soap",
      description: "Handmade natural shea butter soap with organic ingredients and traditional recipes. Perfect for sensitive skin.",
      category: "Crochet Lace Products",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/shea-butter-soap_1024x1024.jpg"],
      price: 1500,
      currency: "INR",
      rating: { average: 4.8, count: 26 },
      seller: {
        id: "seller-015",
        name: "Natural Beauty Co.",
        verified: true
      },
      craftMethod: "Hand-made using traditional soap-making techniques and natural ingredients",
      provenance: "Made in Kerala, India using organic shea butter and natural oils",
      craftingStory: "Each soap is hand-crafted using traditional recipes and organic ingredients.",
      availability: true,
      shippingInfo: {
        weight: 100,
        dimensions: { height: 8, width: 6, depth: 3 },
        estimatedDeliveryDays: 5
      },
      tags: ["shea-butter", "soap", "natural", "organic", "handmade"],
      featured: false,
      popular: true,
      recent: true,
      views: 156,
      likes: 26
    },
    {
      id: "artisan-016",
      title: "Handloom Silk Scarf",
      description: "Luxurious handloom silk scarf with intricate patterns and soft texture. A perfect blend of tradition and elegance.",
      category: "Handloom Sarees and Textiles",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/silk-scarf_1024x1024.jpg"],
      price: 7916,
      currency: "INR",
      rating: { average: 4.7, count: 23 },
      seller: {
        id: "seller-016",
        name: "Silk Heritage",
        verified: true
      },
      craftMethod: "Hand-woven using traditional silk weaving techniques",
      provenance: "Made in Karnataka, India using premium silk",
      craftingStory: "Each scarf is woven by skilled artisans who have mastered the ancient art of silk weaving.",
      availability: true,
      shippingInfo: {
        weight: 150,
        dimensions: { height: 180, width: 60, depth: 1 },
        estimatedDeliveryDays: 8
      },
      tags: ["silk", "scarf", "handloom", "traditional", "luxury"],
      featured: true,
      popular: false,
      recent: false,
      views: 187,
      likes: 33
    },
    {
      id: "artisan-017",
      title: "Traditional Cane Chair",
      description: "Beautiful traditional cane chair with intricate weaving patterns. Comfortable and durable for everyday use.",
      category: "Bamboo and Cane Products",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/cane-chair_1024x1024.jpg"],
      price: 12499,
      currency: "INR",
      rating: { average: 4.6, count: 21 },
      seller: {
        id: "seller-017",
        name: "Cane Furniture Co.",
        verified: true
      },
      craftMethod: "Hand-woven cane with traditional furniture-making techniques",
      provenance: "Made in Assam, India using locally sourced cane",
      craftingStory: "Each chair is hand-woven by skilled craftsmen using traditional techniques.",
      availability: true,
      shippingInfo: {
        weight: 8000,
        dimensions: { height: 90, width: 60, depth: 60 },
        estimatedDeliveryDays: 15
      },
      tags: ["cane", "chair", "furniture", "traditional", "handwoven"],
      featured: false,
      popular: true,
      recent: false,
      views: 123,
      likes: 19
    },
    {
      id: "artisan-018",
      title: "Woolen Handmade Gloves",
      description: "Warm and cozy handmade woolen gloves with traditional patterns. Perfect for cold weather protection.",
      category: "Embroidered Shawls",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/woolen-gloves_1024x1024.jpg"],
      price: 2917,
      currency: "INR",
      rating: { average: 4.5, count: 16 },
      seller: {
        id: "seller-018",
        name: "Mountain Knitters",
        verified: true
      },
      craftMethod: "Hand-knitted using traditional knitting techniques and premium wool",
      provenance: "Made in Himachal Pradesh, India using local sheep wool",
      craftingStory: "Each pair is hand-knitted by skilled artisans using traditional patterns.",
      availability: true,
      shippingInfo: {
        weight: 200,
        dimensions: { height: 25, width: 15, depth: 5 },
        estimatedDeliveryDays: 6
      },
      tags: ["woolen", "gloves", "handmade", "traditional", "warm"],
      featured: false,
      popular: false,
      recent: true,
      views: 84,
      likes: 13
    },
    {
      id: "artisan-019",
      title: "Handwoven Jute Bag",
      description: "Eco-friendly handwoven jute bag with traditional patterns. Perfect for shopping or as a stylish accessory.",
      category: "Bamboo and Cane Products",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/jute-bag_1024x1024.jpg"],
      price: 2083,
      currency: "INR",
      rating: { average: 4.3, count: 12 },
      seller: {
        id: "seller-019",
        name: "Eco Crafts",
        verified: true
      },
      craftMethod: "Hand-woven using traditional jute weaving techniques",
      provenance: "Made in West Bengal, India using natural jute fibers",
      craftingStory: "Each bag is hand-woven by skilled artisans using sustainable jute fibers.",
      availability: true,
      shippingInfo: {
        weight: 300,
        dimensions: { height: 35, width: 40, depth: 10 },
        estimatedDeliveryDays: 7
      },
      tags: ["jute", "bag", "handwoven", "eco-friendly", "sustainable"],
      featured: false,
      popular: false,
      recent: true,
      views: 56,
      likes: 8
    },
    {
      id: "artisan-020",
      title: "Brass Handcrafted Bells",
      description: "Beautiful handcrafted brass bells with traditional designs and clear sound. Perfect for decorative purposes or ceremonies.",
      category: "Brassware and Metal Crafts",
      images: ["https://cdn.shopify.com/s/files/1/0074/4783/6915/products/brass-bells_1024x1024.jpg"],
      price: 3167,
      currency: "INR",
      rating: { average: 4.4, count: 14 },
      seller: {
        id: "seller-020",
        name: "Brass Craftsmen",
        verified: true
      },
      craftMethod: "Hand-crafted brass with traditional metalworking and tuning techniques",
      provenance: "Made in Rajasthan, India using premium brass",
      craftingStory: "Each bell is individually crafted and tuned by skilled metalworkers.",
      availability: true,
      shippingInfo: {
        weight: 250,
        dimensions: { height: 12, width: 8, depth: 8 },
        estimatedDeliveryDays: 8
      },
      tags: ["brass", "bells", "handcrafted", "traditional", "metalwork"],
      featured: false,
      popular: false,
      recent: false,
      views: 71,
      likes: 10
    }
  ];

  return { categories, collectibleItems, artisanProducts };
};

// Dynamic data import - now falls back to default data
const loadProductsData = () => {
  try {
    const productsPath = path.join(__dirname, '../../front-end/src/data/Products.jsx');
    const productsContent = fs.readFileSync(productsPath, 'utf8');
    
    // Since Products.jsx is now deprecated, just return default data
    console.log('📄 Products.jsx is deprecated, using default collectible items...');
    return getDefaultData();
  } catch (error) {
    console.log('📄 Using fallback collectible items data...');
    return getDefaultData();
  }
};

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Utility functions
const createSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();
};

const formatCollectible = (item) => {
  const { id, ...itemWithoutId } = item;
  return {
    ...itemWithoutId,
    // Ensure required fields have defaults
    targetSection: item.targetSection || 'filtered-items-section',
    buttonText: item.buttonText || 'Explore Collection',
    featured: item.featured || false,
    popular: item.popular || false,
    recent: item.recent || false
  };
};

// Add predefined subcategories data
const getCollectibleSubcategories = () => {
  return [
    {
      name: "Coins",
      description: "Antique, commemorative, and rare currency collections",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Mint", "Fine", "Very Fine", "Good", "Poor"],
      collectorType: ["numismatist"],
      tags: ["coins", "currency", "antique", "commemorative"]
    },
    {
      name: "Stamps",
      description: "Historical and limited edition postal stamps",
      historicalEra: "Modern",
      provenanceRequired: false,
      validConditions: ["Mint", "Used", "First Day Cover"],
      collectorType: ["philatelist"],
      tags: ["stamps", "postal", "historical", "limited-edition"]
    },
    {
      name: "Vintage Banknotes",
      description: "Historic paper currency and banknotes",
      historicalEra: "Colonial to Modern",
      provenanceRequired: true,
      validConditions: ["Crisp", "Fine", "Good", "Poor"],
      collectorType: ["numismatist"],
      tags: ["banknotes", "currency", "vintage", "paper-money"]
    },
    {
      name: "Sports Memorabilia",
      description: "Signed jerseys, cricket bats, medals, and sports collectibles",
      historicalEra: "Modern",
      provenanceRequired: true,
      validConditions: ["Mint", "Good", "Used"],
      collectorType: ["sports-collector"],
      tags: ["sports", "memorabilia", "signed", "jerseys", "medals"]
    },
    {
      name: "Comic Books",
      description: "Rare and collectible comic book editions",
      historicalEra: "Modern",
      provenanceRequired: false,
      validConditions: ["Mint", "Near Mint", "Fine", "Good", "Poor"],
      collectorType: ["comic-collector"],
      tags: ["comics", "rare-editions", "graphic-novels"]
    },
    {
      name: "Movie Posters",
      description: "Original, historic, Bollywood, and Hollywood movie posters",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Mint", "Fine", "Good", "Restored"],
      collectorType: ["poster-collector", "film-enthusiast"],
      tags: ["movie-posters", "bollywood", "hollywood", "vintage", "original"]
    },
    {
      name: "Antique Cameras",
      description: "Vintage and collectible photographic equipment",
      historicalEra: "Pre-digital",
      provenanceRequired: true,
      validConditions: ["Working", "Restored", "Display Only"],
      collectorType: ["camera-collector", "photography-enthusiast"],
      tags: ["cameras", "antique", "photography", "vintage"]
    },
    {
      name: "Autographs",
      description: "Signed items from film stars, sports personalities, and political figures",
      historicalEra: "Modern",
      provenanceRequired: true,
      validConditions: ["Authenticated", "Unverified"],
      collectorType: ["autograph-collector"],
      tags: ["autographs", "signed", "celebrities", "sports", "political"]
    },
    {
      name: "Porcelain and Glassware",
      description: "Collectible porcelain, Murano glass, Fenton glass, and fine glassware",
      historicalEra: "Various",
      provenanceRequired: false,
      validConditions: ["Mint", "Good", "Chipped", "Restored"],
      collectorType: ["glass-collector", "porcelain-enthusiast"],
      tags: ["porcelain", "glassware", "murano", "fenton", "decorative"]
    },
    {
      name: "Vintage Toys",
      description: "Tin toys, early action figures, and collectible toys",
      historicalEra: "Mid-20th Century",
      provenanceRequired: false,
      validConditions: ["Mint in Box", "Good", "Used", "Restored"],
      collectorType: ["toy-collector"],
      tags: ["toys", "vintage", "tin-toys", "action-figures"]
    },
    {
      name: "Militaria",
      description: "Military medals, badges, uniforms, and wartime collectibles",
      historicalEra: "Various Wars",
      provenanceRequired: true,
      validConditions: ["Original", "Reproduction", "Restored"],
      collectorType: ["military-collector"],
      tags: ["militaria", "medals", "badges", "uniforms", "wartime"]
    },
    {
      name: "Old Maps and Atlases",
      description: "Historic maps, atlases, and geographical documents",
      historicalEra: "Pre-modern",
      provenanceRequired: true,
      validConditions: ["Fine", "Good", "Aged", "Restored"],
      collectorType: ["cartography-enthusiast"],
      tags: ["maps", "atlases", "geography", "historic", "cartography"]
    },
    {
      name: "Vintage Fashion",
      description: "Designer handbags, vintage clothing, and fashion accessories",
      historicalEra: "20th Century",
      provenanceRequired: false,
      validConditions: ["Mint", "Good", "Used", "Restored"],
      collectorType: ["fashion-collector"],
      tags: ["fashion", "vintage", "designer", "handbags", "clothing"]
    },
    {
      name: "Music Records and Memorabilia",
      description: "Vinyl records, cassettes, signed albums, and music collectibles",
      historicalEra: "Modern",
      provenanceRequired: false,
      validConditions: ["Mint", "Good", "Played", "Rare"],
      collectorType: ["music-collector"],
      tags: ["music", "vinyl", "records", "cassettes", "signed-albums"]
    },
    {
      name: "Scientific Instruments",
      description: "Antique telescopes, compasses, and scientific equipment",
      historicalEra: "Pre-modern to Modern",
      provenanceRequired: true,
      validConditions: ["Working", "Display Only", "Restored"],
      collectorType: ["science-collector"],
      tags: ["scientific", "instruments", "telescopes", "compasses", "antique"]
    },
    {
      name: "Art Deco Objects",
      description: "Art deco sculptures, furniture, and decorative objects",
      historicalEra: "Art Deco Period",
      provenanceRequired: true,
      validConditions: ["Mint", "Good", "Restored"],
      collectorType: ["art-deco-collector"],
      tags: ["art-deco", "sculptures", "furniture", "decorative"]
    },
    {
      name: "Ephemera",
      description: "Historic tickets, brochures, postcards, and paper collectibles",
      historicalEra: "Various",
      provenanceRequired: false,
      validConditions: ["Fine", "Good", "Aged"],
      collectorType: ["ephemera-collector"],
      tags: ["ephemera", "tickets", "postcards", "brochures", "paper"]
    },
    {
      name: "Film Props and Collectibles",
      description: "Movie costumes, set pieces, and film production items",
      historicalEra: "Modern",
      provenanceRequired: true,
      validConditions: ["Screen Used", "Production Made", "Replica"],
      collectorType: ["film-collector"],
      tags: ["film-props", "costumes", "movie", "production", "collectibles"]
    },
    {
      name: "Classic Car Spare Parts",
      description: "Vintage car emblems, horns, and automotive collectibles",
      historicalEra: "Classic Car Era",
      provenanceRequired: true,
      validConditions: ["Original", "Restored", "Reproduction"],
      collectorType: ["automotive-collector"],
      tags: ["car-parts", "emblems", "automotive", "vintage", "classic"]
    },
    {
      name: "Trading Cards",
      description: "Sports cards, movie cards, and gaming collectible cards",
      historicalEra: "Modern",
      provenanceRequired: false,
      validConditions: ["Mint", "Near Mint", "Good", "Poor"],
      collectorType: ["card-collector"],
      tags: ["trading-cards", "sports-cards", "gaming", "collectible"]
    },
    {
      name: "Photos and Photographs",
      description: "Historic photographs and collectible prints",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Fine", "Good", "Aged", "Restored"],
      collectorType: ["photography-collector"],
      tags: ["photographs", "historic", "prints", "collectible"]
    },
    {
      name: "Book First Editions",
      description: "Antiquarian books and rare first edition publications",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Fine", "Good", "Aged", "Restored"],
      collectorType: ["book-collector"],
      tags: ["books", "first-editions", "antiquarian", "rare"]
    },
    {
      name: "Ethnic Artifacts",
      description: "Cultural masks, ritual objects, and ethnic collectibles",
      historicalEra: "Traditional",
      provenanceRequired: true,
      validConditions: ["Original", "Restored", "Aged"],
      collectorType: ["artifact-collector"],
      tags: ["ethnic", "artifacts", "masks", "ritual", "cultural"]
    },
    {
      name: "Watches and Timepieces",
      description: "Luxury watches, antique timepieces, and horological collectibles",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Working", "Serviced", "Display Only", "Parts"],
      collectorType: ["watch-collector"],
      tags: ["watches", "timepieces", "luxury", "antique", "horological"]
    },
    {
      name: "Jewelry",
      description: "Historic jewelry, precious stones, and collectible accessories",
      historicalEra: "Various",
      provenanceRequired: true,
      validConditions: ["Mint", "Good", "Antique", "Restored"],
      collectorType: ["jewelry-collector"],
      tags: ["jewelry", "precious-stones", "historic", "accessories"]
    }
  ];
};

const getArtisanSubcategories = () => {
  return [
    {
      name: "Handloom Sarees and Textiles",
      description: "Traditional handwoven sarees including Banarasi, Kanchipuram, and Chanderi",
      craftTechniques: ["handloom weaving", "silk weaving", "gold thread work"],
      materialTypes: ["silk", "cotton", "gold thread", "silver thread"],
      originRegions: ["Varanasi", "Kanchipuram", "Chanderi", "West Bengal"],
      styleTags: ["traditional", "wedding", "ceremonial"],
      tags: ["sarees", "handloom", "silk", "traditional", "weaving"]
    },
    {
      name: "Block Printed Fabrics",
      description: "Hand block printed textiles from Bagru, Sanganer, and Ajrakh traditions",
      craftTechniques: ["block printing", "natural dyeing", "hand carving"],
      materialTypes: ["cotton", "silk", "natural dyes"],
      originRegions: ["Bagru", "Sanganer", "Gujarat", "Rajasthan"],
      styleTags: ["traditional", "geometric", "floral"],
      tags: ["block-print", "textiles", "natural-dyes", "handmade"]
    },
    {
      name: "Terracotta Pottery and Sculpture",
      description: "Traditional clay pottery and sculptural works",
      craftTechniques: ["pottery", "sculpting", "glazing", "firing"],
      materialTypes: ["clay", "terracotta", "natural pigments"],
      originRegions: ["West Bengal", "Gujarat", "Uttar Pradesh"],
      styleTags: ["traditional", "decorative", "functional"],
      tags: ["terracotta", "pottery", "sculpture", "clay", "handmade"]
    },
    {
      name: "Brassware and Metal Crafts",
      description: "Traditional brass and metal handicrafts from Moradabad and Rajasthan",
      craftTechniques: ["metal casting", "engraving", "embossing", "polishing"],
      materialTypes: ["brass", "copper", "silver", "bronze"],
      originRegions: ["Moradabad", "Rajasthan", "Gujarat"],
      styleTags: ["traditional", "decorative", "functional"],
      tags: ["brassware", "metal-crafts", "engraving", "traditional"]
    },
    {
      name: "Wooden Toys",
      description: "Traditional wooden toys from Channapatna and Varanasi",
      craftTechniques: ["wood turning", "carving", "lacquer work", "painting"],
      materialTypes: ["soft wood", "natural lacquer", "natural colors"],
      originRegions: ["Channapatna", "Varanasi", "Karnataka"],
      styleTags: ["traditional", "colorful", "eco-friendly"],
      tags: ["wooden-toys", "lacquer", "traditional", "eco-friendly"]
    },
    {
      name: "Bamboo and Cane Products",
      description: "Handcrafted baskets, mats, and furniture from bamboo and cane",
      craftTechniques: ["weaving", "basketry", "furniture making"],
      materialTypes: ["bamboo", "cane", "rattan"],
      originRegions: ["Assam", "Tripura", "Northeast India"],
      styleTags: ["traditional", "eco-friendly", "functional"],
      tags: ["bamboo", "cane", "baskets", "eco-friendly", "handwoven"]
    },
    {
      name: "Tribal Jewelry",
      description: "Traditional Dokra, silver jewelry, and beadwork from tribal communities",
      craftTechniques: ["dokra casting", "silver smithing", "beadwork", "wire work"],
      materialTypes: ["brass", "silver", "beads", "natural materials"],
      originRegions: ["Odisha", "West Bengal", "Chhattisgarh", "Jharkhand"],
      styleTags: ["tribal", "traditional", "ethnic"],
      tags: ["tribal-jewelry", "dokra", "silver", "beadwork", "ethnic"]
    },
    {
      name: "Blue Pottery",
      description: "Traditional blue pottery from Jaipur with distinctive glazing",
      craftTechniques: ["pottery", "glazing", "hand painting", "firing"],
      materialTypes: ["clay", "blue glaze", "natural pigments"],
      originRegions: ["Jaipur", "Rajasthan"],
      styleTags: ["traditional", "decorative", "blue-white"],
      tags: ["blue-pottery", "jaipur", "glazed", "decorative"]
    },
    {
      name: "Embroidered Shawls",
      description: "Kashmiri pashmina, Phulkari, and traditional embroidered textiles",
      craftTechniques: ["embroidery", "phulkari", "pashmina weaving"],
      materialTypes: ["pashmina", "wool", "silk", "cotton"],
      originRegions: ["Kashmir", "Punjab", "Himachal Pradesh"],
      styleTags: ["traditional", "luxurious", "warm"],
      tags: ["shawls", "embroidery", "pashmina", "phulkari", "traditional"]
    },
    {
      name: "Stone and Marble Carving",
      description: "Intricate stone and marble sculptures from Agra and Khajuraho",
      craftTechniques: ["stone carving", "marble inlay", "sculpting", "polishing"],
      materialTypes: ["marble", "sandstone", "soapstone"],
      originRegions: ["Agra", "Khajuraho", "Rajasthan", "Uttar Pradesh"],
      styleTags: ["traditional", "architectural", "decorative"],
      tags: ["stone-carving", "marble", "sculpture", "inlay", "traditional"]
    },
    {
      name: "Shell Craft",
      description: "Decorative items made from shells from coastal regions",
      craftTechniques: ["shell carving", "jewelry making", "decoration"],
      materialTypes: ["conch shells", "cowrie shells", "sea shells"],
      originRegions: ["Goa", "Odisha", "coastal regions"],
      styleTags: ["coastal", "decorative", "natural"],
      tags: ["shell-craft", "coastal", "decorative", "natural", "handmade"]
    },
    {
      name: "Glass Craft",
      description: "Colored glass lanterns, vases, and decorative glassware",
      craftTechniques: ["glass blowing", "cutting", "engraving", "coloring"],
      materialTypes: ["colored glass", "crystal", "mirrors"],
      originRegions: ["Uttar Pradesh", "Rajasthan"],
      styleTags: ["decorative", "colorful", "traditional"],
      tags: ["glass-craft", "lanterns", "vases", "colored-glass"]
    },
    {
      name: "Bidriware",
      description: "Traditional metal handicraft from Karnataka with silver inlay",
      craftTechniques: ["metal casting", "silver inlay", "blackening", "engraving"],
      materialTypes: ["zinc", "copper", "silver"],
      originRegions: ["Bidar", "Karnataka"],
      styleTags: ["traditional", "metallic", "decorative"],
      tags: ["bidriware", "metal-craft", "silver-inlay", "karnataka"]
    },
    {
      name: "Leathercraft",
      description: "Handcrafted leather bags, wallets, and Kolhapuri footwear",
      craftTechniques: ["leather working", "tooling", "stitching", "dyeing"],
      materialTypes: ["leather", "natural dyes", "thread"],
      originRegions: ["Kolhapur", "Rajasthan", "Tamil Nadu"],
      styleTags: ["traditional", "functional", "durable"],
      tags: ["leather", "bags", "footwear", "kolhapuri", "handcrafted"]
    },
    {
      name: "Papier Mache",
      description: "Traditional paper pulp crafts from Kashmir and Rajasthan",
      craftTechniques: ["paper molding", "painting", "lacquering", "carving"],
      materialTypes: ["paper pulp", "natural colors", "lacquer"],
      originRegions: ["Kashmir", "Rajasthan"],
      styleTags: ["traditional", "lightweight", "decorative"],
      tags: ["papier-mache", "paper-craft", "traditional", "decorative"]
    },
    {
      name: "Madhubani Paintings",
      description: "Traditional folk paintings from Bihar with natural colors",
      craftTechniques: ["painting", "natural pigments", "brush work"],
      materialTypes: ["natural colors", "paper", "cloth", "bamboo"],
      originRegions: ["Madhubani", "Bihar"],
      styleTags: ["folk", "traditional", "colorful"],
      tags: ["madhubani", "folk-art", "painting", "bihar", "traditional"]
    },
    {
      name: "Kalamkari Paintings",
      description: "Hand-painted textiles and art from Andhra Pradesh",
      craftTechniques: ["hand painting", "block printing", "natural dyeing"],
      materialTypes: ["cotton", "silk", "natural dyes"],
      originRegions: ["Andhra Pradesh", "Telangana"],
      styleTags: ["traditional", "narrative", "religious"],
      tags: ["kalamkari", "hand-painted", "textiles", "traditional"]
    },
    {
      name: "Bell Metal Craft",
      description: "Traditional bell metal items from West Bengal and Odisha",
      craftTechniques: ["metal casting", "engraving", "polishing"],
      materialTypes: ["bell metal", "brass", "bronze"],
      originRegions: ["West Bengal", "Odisha"],
      styleTags: ["traditional", "functional", "ceremonial"],
      tags: ["bell-metal", "traditional", "functional", "ceremonial"]
    },
    {
      name: "Embroidery",
      description: "Traditional Zardozi and Chikankari embroidery work",
      craftTechniques: ["zardozi", "chikankari", "hand embroidery"],
      materialTypes: ["silk", "cotton", "gold thread", "silver thread"],
      originRegions: ["Lucknow", "Delhi", "Kashmir"],
      styleTags: ["traditional", "luxurious", "intricate"],
      tags: ["embroidery", "zardozi", "chikankari", "traditional"]
    },
    {
      name: "Handpainted Pottery",
      description: "Traditional painted pottery from Kutch and Manipur",
      craftTechniques: ["pottery", "hand painting", "glazing"],
      materialTypes: ["clay", "natural colors", "glaze"],
      originRegions: ["Kutch", "Manipur", "Gujarat"],
      styleTags: ["traditional", "colorful", "decorative"],
      tags: ["pottery", "hand-painted", "traditional", "decorative"]
    },
    {
      name: "Wooden Furniture",
      description: "Handcrafted Sheesham and rosewood furniture with carvings",
      craftTechniques: ["wood carving", "joinery", "polishing", "inlay"],
      materialTypes: ["sheesham", "rosewood", "teak", "mango wood"],
      originRegions: ["Rajasthan", "Punjab", "Gujarat"],
      styleTags: ["traditional", "carved", "functional"],
      tags: ["furniture", "wood-carving", "sheesham", "rosewood"]
    },
    {
      name: "Folk Toys and Dolls",
      description: "Traditional folk toys and dolls from Rajasthan and Andhra Pradesh",
      craftTechniques: ["cloth work", "stuffing", "painting", "decoration"],
      materialTypes: ["cloth", "cotton", "natural colors"],
      originRegions: ["Rajasthan", "Andhra Pradesh"],
      styleTags: ["folk", "traditional", "colorful"],
      tags: ["folk-toys", "dolls", "traditional", "handmade"]
    },
    {
      name: "Bamboo Musical Instruments",
      description: "Traditional musical instruments crafted from bamboo",
      craftTechniques: ["bamboo crafting", "tuning", "carving"],
      materialTypes: ["bamboo", "natural materials"],
      originRegions: ["Assam", "Northeast India"],
      styleTags: ["traditional", "musical", "eco-friendly"],
      tags: ["musical-instruments", "bamboo", "traditional", "eco-friendly"]
    },
    {
      name: "Crochet Lace Products",
      description: "Handmade crochet lace items and decorative textiles",
      craftTechniques: ["crocheting", "lace making", "pattern work"],
      materialTypes: ["cotton thread", "silk thread"],
      originRegions: ["Goa", "Kerala", "Karnataka"],
      styleTags: ["traditional", "delicate", "decorative"],
      tags: ["crochet", "lace", "handmade", "textiles", "decorative"]
    }
  ];
};

// Enhanced seeding with subcategories and duplicate handling
const seedDatabase = async (options = {}) => {
  const { clearFirst = true, verbose = true } = options;
  
  try {
    if (verbose) console.log('🌱 Starting database seeding...');
    
    // Force clear collections to avoid duplicates
    if (clearFirst) {
      await CollectibleCategory.deleteMany({});
      await ArtisanProductCategory.deleteMany({});
      await Collectible.deleteMany({});
      await ArtisanProduct.deleteMany({});
      if (verbose) console.log('🗑️  Existing collections cleared');
    }
    
    // Seed collectible subcategories
    const collectibleSubcategories = getCollectibleSubcategories();
    if (collectibleSubcategories.length > 0) {
      // Use upsert to handle duplicates
      const collectibleOps = collectibleSubcategories.map(cat => ({
        updateOne: {
          filter: { name: cat.name },
          update: { $set: cat },
          upsert: true
        }
      }));
      
      const collectibleResult = await CollectibleCategory.bulkWrite(collectibleOps);
      if (verbose) console.log(`📂 ${collectibleResult.upsertedCount + collectibleResult.modifiedCount} collectible subcategories processed`);
    }
    
    // Seed artisan subcategories  
    const artisanSubcategories = getArtisanSubcategories();
    if (artisanSubcategories.length > 0) {
      const artisanOps = artisanSubcategories.map(cat => ({
        updateOne: {
          filter: { name: cat.name },
          update: { $set: cat },
          upsert: true
        }
      }));
      
      const artisanResult = await ArtisanProductCategory.bulkWrite(artisanOps);
      if (verbose) console.log(`📂 ${artisanResult.upsertedCount + artisanResult.modifiedCount} artisan subcategories processed`);
    }
    
    // Load collectible items and artisan products data for seeding
    const { collectibleItems, artisanProducts } = loadProductsData();
    
    // Seed collectibles
    const collectibleDocs = collectibleItems.map(formatCollectible);
    const savedCollectibles = await Collectible.insertMany(collectibleDocs);
    if (verbose) console.log(`🎯 ${savedCollectibles.length} collectibles seeded`);
    
    // Seed artisan products
    if (artisanProducts && artisanProducts.length > 0) {
      const savedArtisanProducts = await ArtisanProduct.insertMany(artisanProducts);
      if (verbose) console.log(`🎨 ${savedArtisanProducts.length} artisan products seeded`);
    }
    
    // Generate summary
    const stats = await getDatabaseStats();
    
    if (verbose) {
      console.log('\n✅ Database seeding completed successfully!');
      console.log('📈 Final Statistics:');
      console.log(`   Collectible Categories: ${stats.collectibleCategories}`);
      console.log(`   Artisan Categories: ${stats.artisanCategories}`);
      console.log(`   Collectibles: ${stats.collectibles}`);
      console.log(`   Artisan Products: ${stats.artisanProducts}`);
    }
    
    return {
      success: true,
      collectibleCategories: stats.collectibleCategories,
      artisanCategories: stats.artisanCategories,
      collectibles: savedCollectibles.length,
      artisanProducts: artisanProducts ? artisanProducts.length : 0,
      stats
    };
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
};

// Clear database function
const clearDatabase = async (verbose = true) => {
  try {
    const collectibleCategoryCount = await CollectibleCategory.countDocuments();
    const artisanCategoryCount = await ArtisanProductCategory.countDocuments();
    const collectibleCount = await Collectible.countDocuments();
    const artisanProductCount = await ArtisanProduct.countDocuments();
    
    await CollectibleCategory.deleteMany({});
    await ArtisanProductCategory.deleteMany({});
    await Collectible.deleteMany({});
    await ArtisanProduct.deleteMany({});
    
    if (verbose) {
      console.log('🗑️  Database cleared successfully');
      console.log(`   Removed ${collectibleCategoryCount} collectible categories`);
      console.log(`   Removed ${artisanCategoryCount} artisan categories`);
      console.log(`   Removed ${collectibleCount} collectibles`);
      console.log(`   Removed ${artisanProductCount} artisan products`);
    }
    
    return { collectibleCategoryCount, artisanCategoryCount, collectibleCount, artisanProductCount };
  } catch (error) {
    console.error('❌ Failed to clear database:', error.message);
    throw error;
  }
};

// Get database statistics
const getDatabaseStats = async () => {
  try {
    const [
      collectibleCategoryCount, 
      artisanCategoryCount, 
      collectibleCount, 
      artisanProductCount,
      featuredCollectibles, 
      popularCollectibles, 
      recentCollectibles,
      featuredArtisanProducts,
      popularArtisanProducts,
      recentArtisanProducts
    ] = await Promise.all([
      CollectibleCategory.countDocuments(),
      ArtisanProductCategory.countDocuments(),
      Collectible.countDocuments(),
      ArtisanProduct.countDocuments(),
      Collectible.countDocuments({ featured: true }),
      Collectible.countDocuments({ popular: true }),
      Collectible.countDocuments({ recent: true }),
      ArtisanProduct.countDocuments({ featured: true }),
      ArtisanProduct.countDocuments({ popular: true }),
      ArtisanProduct.countDocuments({ recent: true })
    ]);
    
    return {
      collectibleCategories: collectibleCategoryCount,
      artisanCategories: artisanCategoryCount,
      collectibles: collectibleCount,
      artisanProducts: artisanProductCount,
      featuredCollectibles: featuredCollectibles,
      popularCollectibles: popularCollectibles,
      recentCollectibles: recentCollectibles,
      featuredArtisanProducts: featuredArtisanProducts,
      popularArtisanProducts: popularArtisanProducts,
      recentArtisanProducts: recentArtisanProducts,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Failed to get database stats:', error.message);
    throw error;
  }
};

// CLI interface
const runCLI = async () => {
  const args = process.argv.slice(2);
  const command = args[0];
  
  await connectDB();
  
  try {
    switch (command) {
      case 'seed':
        await seedDatabase();
        break;
      
      case 'clear':
        await clearDatabase();
        break;
      
      case 'stats':
        const stats = await getDatabaseStats();
        console.log('📊 Database Statistics:');
        console.log(JSON.stringify(stats, null, 2));
        break;
      
      case 'reseed':
        await clearDatabase();
        await seedDatabase();
        break;
      
      default:
        console.log('📋 Available commands:');
        console.log('  npm run seed:data     - Seed database with products data');
        console.log('  npm run clear:data    - Clear all data from database');
        console.log('  npm run stats:data    - Show database statistics');
        console.log('  npm run reseed:data   - Clear and re-seed database');
        break;
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
  
  await mongoose.connection.close();
  console.log('👋 Database connection closed');
  process.exit(0);
};

// Export functions for API use
export { seedDatabase, clearDatabase, getDatabaseStats, connectDB };

// Run CLI if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCLI();
}