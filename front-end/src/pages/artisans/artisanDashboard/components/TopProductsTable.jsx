import React from 'react';

const TopProductsTable = ({ products = [] }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Default products if none provided
  const defaultProducts = [
    {
      id: 1,
      name: 'Hand-carved Wooden Bowl',
      category: 'Woodwork',
      unitsSold: 125,
      revenue: 2500,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Ceramic Vase',
      category: 'Pottery',
      unitsSold: 98,
      revenue: 1960,
      image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Woven Wall Hanging',
      category: 'Textiles',
      unitsSold: 72,
      revenue: 1800,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=100&h=100&fit=crop'
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-stone-200">
        <h3 className="text-lg font-medium text-stone-900">Top Selling Products</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-stone-600 uppercase bg-stone-50 border-b border-stone-200">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">Product Name</th>
              <th scope="col" className="px-6 py-3 font-semibold">Category</th>
              <th scope="col" className="px-6 py-3 font-semibold">Units Sold</th>
              <th scope="col" className="px-6 py-3 font-semibold">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.map((product, index) => (
              <tr 
                key={product.id || index} 
                className={`border-b border-stone-200 hover:bg-stone-50 transition-colors ${
                  index === displayProducts.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <th scope="row" className="px-6 py-4 font-medium text-stone-900 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-stone-100 overflow-hidden flex-shrink-0">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300" />
                      )}
                    </div>
                    <span className="truncate max-w-xs">{product.name}</span>
                  </div>
                </th>
                <td className="px-6 py-4 text-stone-600">{product.category}</td>
                <td className="px-6 py-4 text-stone-600">{product.unitsSold}</td>
                <td className="px-6 py-4 font-semibold text-stone-900">
                  {formatCurrency(product.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {displayProducts.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-stone-500 text-sm">No products found</p>
        </div>
      )}
    </div>
  );
};

export default TopProductsTable;
