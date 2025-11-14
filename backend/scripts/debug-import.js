import { collectibleItems } from './data/collectibleItems.js';

console.log('Total items:', collectibleItems.length);
console.log('\nFirst 3 items:');
collectibleItems.slice(0, 3).forEach((item, idx) => {
  console.log(`\n${idx + 1}. ${item.title}`);
  console.log(`   ID: ${item.id}`);
  console.log(`   Price: ${item.price} (type: ${typeof item.price})`);
  console.log(`   Category: ${item.category}`);
});
