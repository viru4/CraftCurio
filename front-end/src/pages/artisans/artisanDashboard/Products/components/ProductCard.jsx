import React from 'react';
import { Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  const getStockStatus = () => {
    const stock = product.stockQuantity || 0;
    if (stock === 0) {
      return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    }
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-stone-100 to-stone-200">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
            {product.status || 'Active'}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 bg-white rounded-full hover:bg-stone-50 transition-colors shadow-md"
          >
            <MoreVertical className="h-4 w-4 text-stone-700" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-10">
              <button
                onClick={() => {
                  onEdit(product);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  // TODO: Implement view product
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              <hr className="my-1 border-stone-200" />
              <button
                onClick={() => {
                  onDelete(product._id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-stone-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-stone-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-[#ec6d13]">
              {formatCurrency(product.price)}
            </p>
            <p className={`text-xs font-medium ${product.stockQuantity === 0 ? 'text-red-600' : 'text-stone-500'}`}>
              Stock: {product.stockQuantity || 0} units
            </p>
          </div>
          <button
            onClick={() => onEdit(product)}
            className="p-2 rounded-lg bg-[#ec6d13]/10 text-[#ec6d13] hover:bg-[#ec6d13]/20 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
