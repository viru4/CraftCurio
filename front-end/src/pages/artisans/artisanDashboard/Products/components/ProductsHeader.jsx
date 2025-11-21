import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductsHeader = ({ totalProducts, filteredProducts }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-stone-900 text-3xl sm:text-4xl font-black leading-tight tracking-tight">
          My Products
        </h1>
        <p className="text-stone-600 mt-1">
          Showing {filteredProducts} of {totalProducts} products
        </p>
      </div>
      <button
        onClick={() => navigate('/artisan/products/add')}
        className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-[#ec6d13] text-white text-sm font-bold hover:bg-[#ec6d13]/90 transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span>Add Product</span>
      </button>
    </div>
  );
};

export default ProductsHeader;
