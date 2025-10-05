# CraftCurio Database Scripts

This folder contains utility scripts for managing the CraftCurio database with a modern, modular architecture.

## 🎯 Quick Start

```bash
# Seed entire database (recommended)
npm run seed

# Legacy seeding (backup)
npm run seed:legacy

# Clear database
npm run clear

# Get statistics
npm run stats
```

## 📁 File Structure

```text
scripts/
├── data/                          # Organized data definitions
│   ├── artisanProducts.js        # 20 artisan products with full metadata
│   ├── categories.js             # Category definitions (25+24 categories)
│   └── collectibleItems.js       # 10 collectible items
├── seeders/                      # Modular seeder functions
│   ├── artisanSeeder.js         # Artisan product seeding with bulkWrite
│   ├── categorySeeder.js        # Category seeding with subcategories
│   ├── collectibleSeeder.js     # Collectible item seeding
│   └── utils.js                 # Database utilities and stats
├── seed.js                      # 🔥 Main modular orchestrator
├── seedData.js                  # Legacy monolithic seeder (backup)
├── testDatabase.js              # Direct database testing utility
└── README.md                    # This documentation
```

## 🚀 Modern Modular System

### Primary Commands

```bash
# Full database seeding with categories and products
npm run seed

# Quiet mode (minimal output)
npm run seed:quiet

# Preserve existing data (no clearing)
npm run seed:no-clear

# Database utilities
npm run clear           # Clear all collections
npm run stats          # Show detailed statistics
```

### Legacy Commands (Backup)

```bash
npm run seed:legacy     # Original monolithic seeder
npm run clear:legacy    # Legacy clear command
npm run stats:legacy    # Legacy statistics
npm run reseed:legacy   # Legacy reseed command
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

## 🔧 Development Notes

### Import Structure

- Uses ES6 modules with proper default/named exports
- Modular imports for better code organization
- Proper error handling for import failures

### Database Operations

- MongoDB Atlas connection with proper cleanup
- Mongoose schema validation and indexing
- Bulk operations for performance optimization

### Extensibility

- Easy to add new product categories
- Simple to extend with additional collections
- Modular seeders can be run independently
