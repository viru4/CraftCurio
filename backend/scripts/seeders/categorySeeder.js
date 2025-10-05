import CollectibleCategory from '../../src/models/collectiblecategory.js';
import ArtisanProductCategory from '../../src/models/ArtisanProductCategory.js';

// Predefined subcategories data
export const getCollectibleSubcategories = () => {
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

export const getArtisanSubcategories = () => {
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

// Seeding functions
export const seedCategories = async (verbose = true) => {
  try {
    // Seed collectible subcategories
    const collectibleSubcategories = getCollectibleSubcategories();
    if (collectibleSubcategories.length > 0) {
      const collectibleOps = collectibleSubcategories.map(cat => ({
        updateOne: {
          filter: { name: cat.name },
          update: { $set: cat },
          upsert: true
        }
      }));
      
      const collectibleResult = await CollectibleCategory.bulkWrite(collectibleOps);
      if (verbose) {
        console.log(`📂 ${collectibleResult.upsertedCount + collectibleResult.modifiedCount} collectible subcategories processed`);
      }
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
      if (verbose) {
        console.log(`📂 ${artisanResult.upsertedCount + artisanResult.modifiedCount} artisan subcategories processed`);
      }
    }

    return {
      collectible: collectibleSubcategories.length,
      artisan: artisanSubcategories.length
    };
  } catch (error) {
    console.error('❌ Category seeding failed:', error.message);
    throw error;
  }
};