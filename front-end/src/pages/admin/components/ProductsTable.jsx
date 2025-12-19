import { useState } from 'react';
import { MoreVertical, Eye, Edit, CheckCircle, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/date';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../../lib/currency';

const ProductsTable = ({ 
  products, 
  loading, 
  activeTab, 
  onDelete, 
  onStatusChange,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    
    const styles = {
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[statusLower] || styles.pending}`}>
        {status || 'Pending'}
      </span>
    );
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return 'https://via.placeholder.com/40';
  };

  const getProductName = (product) => {
    return product.name || product.title || 'Unnamed Product';
  };

  const looksLikeId = (value) => {
    if (!value || typeof value !== 'string') return false;
    const trimmed = value.trim();
    // 24-char hex Mongo ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(trimmed)) return true;
    // Generic UUID-like or opaque IDs - long, opaque strings with digits
    if (trimmed.length > 20 && /[0-9]/.test(trimmed)) return true;
    return false;
  };

  const getArtisanName = (product) => {
    // For artisan products, artisan info may be in `artisan` or `artisanInfo`
    if (product.artisan) {
      if (typeof product.artisan === 'object') {
        return product.artisan.name || product.artisan.displayName || 'Unknown Artisan';
      }
      return looksLikeId(product.artisan) ? 'Unknown Artisan' : product.artisan;
    }

    if (product.artisanInfo) {
      if (typeof product.artisanInfo === 'object') {
        return product.artisanInfo.name || product.artisanInfo.displayName || 'Unknown Artisan';
      }
      return looksLikeId(product.artisanInfo) ? 'Unknown Artisan' : product.artisanInfo;
    }

    // For collectibles, seller/owner is usually in `owner`
    if (product.owner) {
      if (typeof product.owner === 'object') {
        return product.owner.name || product.owner.displayName || 'Unknown Seller';
      }
      return looksLikeId(product.owner) ? 'Unknown Seller' : product.owner;
    }

    // Fallbacks
    if (product.sellerName) return product.sellerName;
    if (product.createdByName) return product.createdByName;

    return 'Unknown Seller';
  };

  const getCategoryName = (product) => {
    if (product.category) {
      return typeof product.category === 'object'
        ? product.category.name
        : product.category;
    }
    return 'Uncategorized';
  };

  const getSaleTypeBadge = (product) => {
    const saleType = (product.saleType || 'direct').toLowerCase();

    if (saleType === 'auction') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          Auction
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        Direct Sale
      </span>
    );
  };

  const getAuctionSummary = (product) => {
    if (product.saleType !== 'auction' || !product.auction) return '—';

    const { auction } = product;
    const currentBid = auction.currentBid ?? 0;
    const status = auction.auctionStatus || 'scheduled';
    const totalBids = auction.totalBids ?? 0;

    return `${status.charAt(0).toUpperCase() + status.slice(1)} · Current ₹${currentBid.toFixed(0)} · ${totalBids} bids`;
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  if (loading) {
    return (
      <div className="bg-[#f8f7f6] dark:bg-[#221810] border border-[#f3ece7] dark:border-[#3a2a1d] rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ec6d13] border-t-transparent"></div>
          <p className="mt-4 text-[#9a6c4c] dark:text-[#a18a7a]">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-[#f8f7f6] dark:bg-[#221810] border border-[#f3ece7] dark:border-[#3a2a1d] rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-[#9a6c4c] dark:text-[#a18a7a]">No products found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f7f6] dark:bg-[#221810] border border-[#f3ece7] dark:border-[#3a2a1d] rounded-lg overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#ec6d13] scrollbar-track-[#f3ece7] dark:scrollbar-track-[#3a2a1d]">
        <table className="w-full text-sm text-left text-[#9a6c4c] dark:text-[#a18a7a]" style={{ minWidth: '1000px' }}>
          <thead className="text-xs uppercase bg-[#f3ece7] dark:bg-[#3a2a1d]">
            <tr>
              <th className="p-4" scope="col">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#ec6d13] bg-gray-100 border-gray-300 rounded focus:ring-[#ec6d13]"
                  checked={selectedProducts.length === products.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 min-w-[250px]" scope="col">Product</th>
              <th className="px-6 py-3 min-w-[150px]" scope="col">Artisan</th>
              <th className="px-6 py-3 min-w-[120px]" scope="col">Category</th>
              {activeTab === 'collectible' && (
                <th className="px-6 py-3 min-w-[120px]" scope="col">Type</th>
              )}
              <th className="px-6 py-3 min-w-[100px]" scope="col">Status</th>
              <th className="px-6 py-3 min-w-[140px]" scope="col">
                {activeTab === 'collectible' ? 'Price / Auction' : 'Price'}
              </th>
              <th className="px-6 py-3 min-w-[130px]" scope="col">Date Added</th>
              <th className="px-6 py-3 min-w-[100px]" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr 
                key={product._id || product.id} 
                className="border-b border-[#f3ece7] dark:border-[#3a2a1d] hover:bg-[#f3ece7]/50 dark:hover:bg-[#3a2a1d]/50"
              >
                <td className="w-4 p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#ec6d13] bg-gray-100 border-gray-300 rounded focus:ring-[#ec6d13]"
                    checked={selectedProducts.includes(product._id || product.id)}
                    onChange={() => handleSelectProduct(product._id || product.id)}
                  />
                </td>
                <th className="px-6 py-4 font-medium" scope="row">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <img
                      className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                      src={getProductImage(product)}
                      alt={getProductName(product)}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                    />
                    <span className="text-[#1b130d] dark:text-[#fcfaf8]">{getProductName(product)}</span>
                  </div>
                </th>
                <td className="px-6 py-4 whitespace-nowrap">{getArtisanName(product)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getCategoryName(product)}</td>
                {activeTab === 'collectible' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSaleTypeBadge(product)}
                    {product.saleType === 'auction' && (
                      <div className="mt-1 text-xs text-[#9a6c4c] dark:text-[#a18a7a]">
                        {getAuctionSummary(product)}
                      </div>
                    )}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(product.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activeTab === 'collectible' && product.saleType === 'auction' && product.auction
                    ? (
                      <div className="flex flex-col">
                        <span>{formatPrice(product.auction.currentBid ?? product.price ?? 0)}</span>
                        {product.auction.buyNowPrice ? (
                          <span className="text-xs text-[#9a6c4c] dark:text-[#a18a7a]">
                            Buy Now: {formatPrice(product.auction.buyNowPrice)}
                          </span>
                        ) : null}
                      </div>
                    )
                    : formatPrice(product.price || 0)
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(product.createdAt || product.dateAdded)}</td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === product._id ? null : product._id)}
                      className="text-[#9a6c4c] dark:text-[#a18a7a] hover:text-[#ec6d13]"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {openMenuId === product._id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 z-20 w-48 py-1 mt-2 bg-white dark:bg-[#2a1e14] border border-[#e7d9cf] dark:border-[#3f2e1e] rounded-md shadow-lg">
                          <button
                            onClick={() => {
                              navigate(`/product/${activeTab}/${product._id || product.id}`);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d]"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/admin/products/edit/${product._id || product.id}`);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d]"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          {product.status !== 'approved' && (
                            <button
                              onClick={() => {
                                onStatusChange(product._id || product.id, 'approved');
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d]"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onDelete(product._id || product.id);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d]"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
        <span className="text-sm font-normal text-[#9a6c4c] dark:text-[#a18a7a]">
          Showing <span className="font-semibold text-[#1b130d] dark:text-[#fcfaf8]">{startIndex}-{endIndex}</span> of{' '}
          <span className="font-semibold text-[#1b130d] dark:text-[#fcfaf8]">{totalItems}</span>
        </span>
        <ul className="inline-flex items-center -space-x-px overflow-x-auto">
          <li>
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 h-8 leading-tight text-[#9a6c4c] dark:text-[#a18a7a] bg-[#f8f7f6] dark:bg-[#221810] border border-[#f3ece7] dark:border-[#3a2a1d] rounded-l-md hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index + 1}>
              <button
                onClick={() => onPageChange(index + 1)}
                className={`px-3 h-8 leading-tight border border-[#f3ece7] dark:border-[#3a2a1d] ${
                  currentPage === index + 1
                    ? 'text-[#1b130d] dark:text-[#fcfaf8] bg-[#f3ece7] dark:bg-[#3a2a1d]'
                    : 'text-[#9a6c4c] dark:text-[#a18a7a] bg-[#f8f7f6] dark:bg-[#221810] hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d]'
                }`}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 h-8 leading-tight text-[#9a6c4c] dark:text-[#a18a7a] bg-[#f8f7f6] dark:bg-[#221810] border border-[#f3ece7] dark:border-[#3a2a1d] rounded-r-md hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProductsTable;
