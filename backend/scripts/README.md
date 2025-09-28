# Database Scripts

This folder contains utility scripts for managing the CraftCurio database.

## seedData.js

A comprehensive script for managing database seeding operations with the following commands:

### Available Commands

```bash
# Seed the database with categories and collectibles
npm run seed:data

# Clear all data from database
npm run clear:data

# Get database statistics
npm run stats:data

# Clear and reseed database
npm run reseed:data
```

### Features

- **Dynamic Data Loading**: Automatically reads and parses data from `../front-end/src/data/Products.jsx`
- **Fallback Data**: Uses embedded data if Products.jsx cannot be read
- **MongoDB Connection**: Automatic connection management with proper cleanup
- **CLI Interface**: Command-line arguments for different operations
- **Error Handling**: Comprehensive error handling and logging
- **Statistics**: Detailed counts and metrics

### Data Processing

The script processes:

- **14 Categories**: Various collectible categories with descriptions and slugs
- **33 Collectible Items**: Complete product catalog with pricing and metadata
- **Automatic Indexing**: Creates text search indexes for better performance
- **Category Counts**: Updates category item counts automatically

### Usage Examples

```bash
# Direct script usage
node scripts/seedData.js seed
node scripts/seedData.js clear
node scripts/seedData.js stats
node scripts/seedData.js reseed

# Via npm scripts (recommended)
npm run seed:data
npm run clear:data
npm run stats:data
npm run reseed:data
```

### Output Format

The script provides detailed console output with emojis for better readability:

- ✅ Success operations
- 🌱 Seeding operations
- 🗑️ Clearing operations  
- 📊 Statistics
- ❌ Error conditions
- 👋 Connection status

### Error Handling

- File system errors (Products.jsx not found)
- Database connection failures
- Invalid command arguments
- Mongoose operation errors
- Automatic connection cleanup
