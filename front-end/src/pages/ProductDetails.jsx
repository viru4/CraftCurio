import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout';
import API_BASE_URL from '../config/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import {
  StarRating,
  ProductImageGallery,
  BreadcrumbNavigation,
  ProductPriceCard,
  ProductSpecifications,
  ArtisanProfileCard,
  ProductStorySection,
  ReviewsList,
  TabNavigation,
  ProductBadges,
  ShippingReturnsSection
} from '../components/productDetailPage';

const ProductDetails = () => {
  const { type, id } = useParams(); // type can be 'artisan-product' or 'collectible'
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('reviews');
  const [showAlert, setShowAlert] = useState(false);

  // Determine if this is a collectible or artisan product
  const isCollectible = type === 'collectible';

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log(`Fetching ${type} with ID:`, id);
        
        // Determine API endpoint based on type
        const endpoint = isCollectible 
          ? `${API_BASE_URL}/api/collectibles/${id}`
          : `${API_BASE_URL}/api/artisan-products/${id}`;
        
        const response = await fetch(endpoint);
        
        console.log('Response status:', response.status);
        console.log('Response OK:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          throw new Error(`Product not found (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Product data received:', data);
        
        // Normalize data structure for collectibles
        let normalizedProduct = data.data;
        if (isCollectible) {
          normalizedProduct = {
            ...data.data,
            // Ensure images array exists
            images: data.data.images?.length > 0 ? data.data.images : [data.data.image],
            // Convert price string to number if needed
            price: typeof data.data.price === 'string' ? parseFloat(data.data.price.replace(/[^0-9.-]+/g, '')) : data.data.price,
            // Add empty structures for optional fields
            rating: data.data.rating || { average: 0, count: 0 },
            reviews: data.data.reviews || [],
            artisanInfo: null, // Collectibles don't have artisan info
            craftMethod: data.data.craftMethod || null,
            provenance: data.data.provenance || null,
            history: data.data.history || null,
            productStory: data.data.productStory || null
          };
        }
        
        setProduct(normalizedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchProduct();
    }
  }, [id, type, isCollectible]);

  // Handle toggle wishlist
  const handleToggleWishlist = () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      alert('Please sign in to add items to your wishlist');
      navigate('/sign-in');
      return;
    }

    if (!product) return;

    const wishlistProduct = {
      id: product._id || product.id,
      name: product.title,
      price: typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^0-9.]/g, '')) 
        : product.price,
      image: product.images?.[0] || product.image,
      artisan: product.artisanInfo?.name || product.artisan || 'Artisan',
      category: product.category,
      type: type,
    };

    toggleWishlist(wishlistProduct);
  };

  // Handle add to cart
  const handleAddToCart = (quantity = 1) => {
    if (!product) return;

    // Check if user is logged in
    if (!isAuthenticated) {
      alert('Please sign in to add items to your cart');
      navigate('/sign-in');
      return;
    }

    const cartProduct = {
      id: product._id || product.id,
      name: product.title,
      price: typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^0-9.]/g, '')) 
        : product.price,
      image: product.images?.[0] || product.image,
      artisan: product.artisanInfo?.name || product.artisan || 'Artisan',
      category: product.category,
    };

    // Add to cart with specified quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }

    // Show success alert
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Product Not Found</h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // No product data
  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-stone-600">No product data available</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      {/* Success Alert */}
      {showAlert && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold">Added to cart!</p>
              <p className="text-sm text-green-100">{product?.title}</p>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="ml-4 hover:bg-green-600 rounded p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumb */}
          <BreadcrumbNavigation 
            category={product.category}
            productTitle={product.title}
          />

          {/* Product Content */}
          <div className={`grid grid-cols-1 gap-8 lg:gap-12 ${isCollectible ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
            {/* Product Images - Takes up 2 columns on desktop for artisan, 1 column for collectibles */}
            <div className={isCollectible ? 'lg:col-span-1' : 'lg:col-span-2'}>
              <ProductImageGallery
                images={product.images || [product.image]}
                title={product.title}
                selectedImageIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
              />

              {/* Mobile Product Details - Only visible on mobile/tablet */}
              <div className="lg:hidden">
                {/* Title and Description */}
                <div className="mb-6">
                  {isCollectible && product.category && (
                    <a className="text-orange-600 text-base font-medium leading-normal hover:underline mb-2 block" href="#">
                      {product.category}
                    </a>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
                    {product.title}
                  </h1>
                  {isCollectible && product.artisanInfo?.name && (
                    <p className="text-stone-600 text-sm font-normal leading-normal mt-2">
                      By <a className="text-orange-600 underline font-medium" href="#">{product.artisanInfo.name}</a>
                    </p>
                  )}
                  {!isCollectible && (
                    <p className="text-stone-600 mt-2 text-sm md:text-base">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Badges for Collectibles */}
                {isCollectible && (
                  <div className="mb-6">
                    <ProductBadges product={product} />
                  </div>
                )}

                {/* Price and Action Buttons */}
                <ProductPriceCard
                  price={product.price || 0}
                  availability={product.availability}
                  isInWishlist={isInWishlist(product._id || product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  isMobile={true}
                  isCollectible={isCollectible}
                />

                {/* Description for Collectibles */}
                {isCollectible && product.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-stone-900 mb-3">Description</h3>
                    <div className="prose prose-sm max-w-none text-stone-700 leading-relaxed">
                      <p>{product.description}</p>
                    </div>
                  </div>
                )}

                <ProductSpecifications product={product} isMobile={true} isCollectible={isCollectible} />

                {/* Shipping & Returns for Collectibles */}
                {isCollectible && (
                  <div className="border-t border-stone-200 pt-6 mt-6">
                    <ShippingReturnsSection shippingInfo={product.shippingInfo} />
                  </div>
                )}

                {/* Artisan Profile Mobile - Only for artisan products */}
                {!isCollectible && product.artisanInfo && (
                  <ArtisanProfileCard 
                    artisanInfo={product.artisanInfo}
                    isMobile={true}
                  />
                )}
              </div>
            </div>

            {/* Desktop Sidebar - Product Info */}
            <div className="hidden lg:block lg:col-span-1">
              <div className={isCollectible ? 'space-y-6' : 'sticky top-8 space-y-6'}>
                {/* Category link for collectibles */}
                {isCollectible && product.category && (
                  <a className="text-orange-600 text-base font-medium leading-normal hover:underline" href="#">
                    {product.category}
                  </a>
                )}
                
                {/* Title and Description */}
                <div>
                  <h1 className="text-3xl xl:text-4xl font-black text-stone-900 tracking-tighter leading-tight">
                    {product.title}
                  </h1>
                  {isCollectible && product.artisanInfo?.name && (
                    <p className="text-stone-600 text-sm font-normal leading-normal mt-2">
                      By <a className="text-orange-600 underline font-medium" href="#">{product.artisanInfo.name}</a>
                    </p>
                  )}
                  {!isCollectible && (
                    <p className="text-stone-600 mt-3 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Badges for Collectibles */}
                {isCollectible && (
                  <ProductBadges product={product} />
                )}

                {/* Price and Action Buttons - Using ProductPriceCard component */}
                <ProductPriceCard
                  price={product.price || 0}
                  availability={product.availability}
                  isInWishlist={isInWishlist(product._id || product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  isMobile={false}
                  isCollectible={isCollectible}
                />

                {/* Description for Collectibles */}
                {isCollectible && product.description && (
                  <div className="flex flex-col gap-3 border-t border-stone-200 pt-6">
                    <h2 className="text-xl font-bold text-stone-800">Description</h2>
                    <div className="prose prose-sm max-w-none text-stone-700 leading-relaxed">
                      <p>{product.description}</p>
                    </div>
                  </div>
                )}

                <ProductSpecifications product={product} isMobile={false} isCollectible={isCollectible} />

                {/* Shipping & Returns for Collectibles */}
                {isCollectible && (
                  <div className="border-t border-stone-200 pt-6">
                    <ShippingReturnsSection shippingInfo={product.shippingInfo} />
                  </div>
                )}

                {/* Customer Reviews for Collectibles */}
                {isCollectible && product.reviews && product.reviews.length > 0 && (
                  <div className="flex flex-col gap-4 border-t border-stone-200 pt-6">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xl font-bold text-stone-800">Customer Reviews</h2>
                      <div className="flex items-center gap-1">
                        <div className="flex text-orange-500">
                          <StarRating rating={product.rating?.average || 0} size="text-base" />
                        </div>
                        <p className="text-stone-700 text-sm font-medium">{product.rating?.average?.toFixed(1) || '0.0'} ({product.rating?.count || 0} reviews)</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {product.reviews.slice(0, 2).map((review, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-4 rounded-lg bg-stone-100 border border-stone-200">
                          <div className="flex items-center gap-2">
                            <div className="flex text-orange-500">
                              <StarRating rating={review.userRating || 5} size="text-sm" />
                            </div>
                            <h4 className="font-bold text-stone-900">{review.reviewTitle || 'Great product!'}</h4>
                          </div>
                          <p className="text-stone-700 text-sm">"{review.reviewText || 'Excellent quality and fast shipping!'}"
                          </p>
                          <p className="text-xs text-stone-500">- {review.userName || 'Anonymous'} on {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'Recently'}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full sm:w-auto self-start rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100 transition-colors">
                      Write a review
                    </button>
                  </div>
                )}

                {/* Artisan Profile - Only for artisan products */}
                {!isCollectible && product.artisanInfo && (
                  <ArtisanProfileCard 
                    artisanInfo={product.artisanInfo}
                    showInSidebar={true}
                  />
                )}

                {/* Customer Reviews Summary - Only for artisan products */}
                {!isCollectible && (
                  <div className="border-t border-stone-200 pt-6">
                    <h3 className="text-lg font-bold text-stone-900 mb-4">
                      Customer Reviews
                    </h3>
                    <div className="text-center">
                      <p className="text-3xl font-black text-stone-800">
                        {product.rating?.average?.toFixed(1) || '0.0'}
                      </p>
                      <div className="flex justify-center mt-1">
                        <StarRating rating={product.rating?.average || 0} size="text-lg" />
                      </div>
                      <p className="text-sm text-stone-500 mt-2">
                        Based on {product.rating?.count || 0} reviews
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Story Section - Full Width Below Product - Only for artisan products */}
          {!isCollectible && (
            <div className="mt-12 lg:mt-16">
              <ProductStorySection product={product} />
            </div>
          )}

          {/* Reviews Section - Only show for artisan products with reviews */}
          {!isCollectible && product.reviews && product.reviews.length > 0 && (
            <div className="mt-12 lg:mt-16">
              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {/* Reviews Content */}
              {activeTab === 'reviews' && (
                <ReviewsList reviews={product.reviews} />
              )}

              {/* Q&A Content */}
              {activeTab === 'qa' && (
                <div className="py-12 text-center">
                  <p className="text-stone-500">Q&A section coming soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;