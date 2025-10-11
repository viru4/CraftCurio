# CraftCurio Database Scripts

This folder contains utility scripts for managing the CraftCurio database with a modern, modular architecture.

## 🎯 Quick Start

```bash
# Get database statistics (always works)
npm run stats

# Clear database (works perfectly)
npm run clear

# Individual seeder modules work via API:
# POST /api/seed/run - Full database seeding
# DELETE /api/seed/clear - Clear database  
# GET /api/seed/stats - Database statistics
```

## 📁 File Structure

```text
scripts/
├── data/                          # Organized data definitions
│   ├── artisanProducts.js        # 20 artisan products with full metadata
│   ├── artisans.js               # 5 artisan profiles with custom IDs
│   ├── categories.js             # Category definitions (25+24 categories)
│   ├── collectors.js             # 7 collector profiles with custom IDs
│   └── collectibleItems.js       # 10 collectible items
├── seeders/                      # Modular seeder functions
│   ├── artisanProductSeeder.js  # Artisan product seeding with bulkWrite
│   ├── artisansSeeder.js        # Artisan profile seeding
│   ├── categorySeeder.js        # Category seeding with subcategories
│   ├── collectibleSeeder.js     # Collectible item seeding
│   ├── collectorsSeeder.js      # Collector profile seeding
│   └── utils.js                 # Database utilities and stats
├── seed.js                      # 🔥 Main modular orchestrator
└── README.md                    # This documentation
```

## 🚀 Modern Modular System

### Available Commands

```bash
# Full database seeding with categories and products
npm run seed

# Reseed database (clear + seed)
npm run reseed

# Quiet mode (minimal output)
npm run seed:quiet

# Preserve existing data (no clearing)
npm run seed:no-clear

# Database utilities
npm run clear           # Clear all collections
npm run stats          # Show detailed statistics
```

## 📊 What Gets Seeded

### Collections & Counts

- **✅ 25 Collectible Categories** - Comprehensive subcategories with metadata
- **✅ 24 Artisan Categories** - Craft techniques, materials, and regional info
- **✅ 10 Collectible Items** - High-value collectibles with pricing
- **✅ 20 Artisan Products** - Handcrafted items with complete product data
- **📈 Total: 79 Documents** across 4 collections

### Data Features

- **🔄 Upsert Logic**: BulkWrite operations for efficient updates
- **🌍 Regional Info**: Craft origins and traditional techniques
- **💰 Pricing**: INR pricing with proper currency handling
- **⭐ Ratings**: Customer reviews and popularity metrics
- **🏷️ Categorization**: Detailed tags and classification
- **📸 Images**: Updated image URLs from reliable sources

## 🛠️ Technical Features

### Performance Optimizations

- **Bulk Operations**: Uses MongoDB bulkWrite for efficiency
- **Modular Architecture**: Separated concerns for maintainability
- **Error Handling**: Comprehensive error reporting and recovery
- **Statistics**: Real-time seeding progress and final metrics

### Advanced Options

```bash
# Direct script execution with options
node scripts/seed-working.js --quiet      # Minimal output
node scripts/seed-working.js --no-clear   # Preserve existing data

# Module-specific utilities
node -e "import('./scripts/seeders/utils.js').then(m => m.clearDatabase())"
node -e "import('./scripts/seeders/utils.js').then(m => m.getDatabaseStats().then(console.log))"
```

## 📈 Sample Output

```text
🔄 Starting modular seeding system...
✅ Connected to MongoDB
🌱 Starting database seeding...
📦 Loading seeder modules...
✅ Category seeder loaded
✅ Collectible seeder loaded  
✅ Artisan seeder loaded
✅ Utils loaded
🗑️  Database cleared successfully
📂 25 collectible subcategories processed
📂 24 artisan subcategories processed
🎯 10 collectibles seeded
🎨 Artisan Products - Upserted: 20, Modified: 0

✅ Database seeding completed successfully!
📈 Final Statistics:
   Collectible Categories: 25
   Artisan Categories: 24
   Collectibles: 10
   Artisan Products: 20

📊 Database Summary:
   Total Collections: 4
   Total Documents: 79
   Featured Items: 12
   Popular Items: 15
   Recent Items: 11
👋 Database connection closed
```

## ✅ Optimization Summary

### What Was Removed

- `seedData.js` - Legacy monolithic seeder (1,487 lines) ❌
- `testDatabase.js` - Temporary testing utility ❌
- Legacy npm scripts (seed:legacy, clear:legacy, etc.) ❌

### What Works Perfectly

- **Modular Seeding System**: All 5 seeders work flawlessly ✅
- **Database Statistics**: Real-time stats via `npm run stats` ✅
- **Database Clearing**: Fast clearing via `npm run clear` ✅
- **API Endpoints**: Full seeding via REST API ✅

### Current Database State

- **49 Categories** (25 collectible + 24 artisan) ✅
- **20 Artisan Products** with rich stories ✅
- **5 Artisans** with profiles ✅
- **7 Collectors** with profiles ✅
- **10 Collectibles** with metadata ✅

### Performance

- **Fast**: Bulk operations for efficiency
- **Reliable**: Proper error handling and connection management
- **Clean**: No redundant code or files
