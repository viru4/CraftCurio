import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('reviews');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        const response = await fetch(`http://localhost:3000/api/artisan-products/${id}`);
        
        console.log('Response status:', response.status);
        console.log('Response OK:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          throw new Error(`Product not found (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Product data received:', data);
        setProduct(data.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Handle like product
  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/artisan-products/${id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProduct(prev => ({
          ...prev,
          likes: data.data.likes
        }));
      }
    } catch (err) {
      console.error('Error liking product:', err);
    }
  };

  // Render star rating
  const renderStars = (rating, size = 'text-lg') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className={`material-symbols-outlined ${size} text-yellow-500`}>
          star
        </span>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className={`material-symbols-outlined ${size} text-yellow-500`}>
          star_half
        </span>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className={`material-symbols-outlined ${size} text-stone-300`}>
          star
        </span>
      );
    }
    
    return stars;
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
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-6 md:mb-8 overflow-x-auto">
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-orange-500 whitespace-nowrap"
            >
              Home
            </button>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <button 
              onClick={() => navigate('/categories')} 
              className="hover:text-orange-500 whitespace-nowrap"
            >
              {product.category}
            </button>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-stone-800 truncate">{product.title}</span>
          </div>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <div className="w-full aspect-square bg-stone-200 rounded-lg shadow-sm overflow-hidden">
                <img
                  src={product.images?.[selectedImageIndex] || product.image || '/placeholder-image.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.svg';
                  }}
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-full aspect-square bg-stone-200 rounded-md overflow-hidden transition-all ${
                        selectedImageIndex === index 
                          ? 'border-2 border-orange-500 opacity-100' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              {/* Title and Description */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
                  {product.title}
                </h1>
                <p className="text-stone-600 mt-2 text-sm md:text-base">
                  {product.description}
                </p>
              </div>

              {/* Enhanced Product Story Section */}
              <section className="product-story bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-100 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-3xl text-orange-600">auto_stories</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
                      The Story Behind This Craft
                    </h2>
                  </div>
                  
                  {/* Story Content */}
                  <div className="space-y-6">
                    {/* Cultural Heritage & Legacy Story Section */}
                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-orange-600">history_edu</span>
                        <h3 className="text-xl font-bold text-stone-800">The Story Behind This Masterpiece</h3>
                      </div>
                      
                      {/* Rich Story Content */}
                      <div className="prose prose-stone max-w-none">
                        <p className="text-stone-700 leading-relaxed text-base mb-4 font-medium first-letter:text-4xl first-letter:font-bold first-letter:text-orange-600 first-letter:mr-1 first-letter:float-left first-letter:leading-none first-letter:mt-1">
                          {product.productStory?.storyText || product.craftingStory || 
                          `This ${product.title.toLowerCase()} represents centuries of traditional craftsmanship passed down through generations. Each piece tells a story of cultural preservation and artistic excellence, embodying the rich heritage of ${product.provenance?.split(',')[1]?.trim() || 'traditional artisanship'}.`}
                        </p>
                      </div>

                      {/* Story Highlights */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-orange-100">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="material-symbols-outlined text-orange-600 text-lg">place</span>
                          </div>
                          <div>
                            <p className="font-semibold text-stone-800 mb-1">Origin</p>
                            <p className="text-stone-600 text-sm">{product.provenance || 'Traditional artisan regions of India'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="material-symbols-oriented text-orange-600 text-lg">schedule</span>
                          </div>
                          <div>
                            <p className="font-semibold text-stone-800 mb-1">Heritage</p>
                            <p className="text-stone-600 text-sm">Centuries-old tradition preserved through generations</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Crafting Journey Section */}
                    <div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-orange-600">handyman</span>
                        <h3 className="text-lg font-semibold text-stone-800">The Crafting Journey</h3>
                      </div>
                      <p className="text-stone-700 leading-relaxed mb-4">
                        {product.craftMethod || 
                        `Created using time-honored techniques, this piece showcases the meticulous attention to detail that defines traditional craftsmanship. Every element is carefully shaped by skilled hands, preserving methods that have been refined over generations.`}
                      </p>
                      
                      {/* Process Timeline */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                            <span className="text-orange-700 font-bold text-sm">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">Material Selection</p>
                            <p className="text-xs text-stone-600">Sourcing finest materials</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                            <span className="text-orange-700 font-bold text-sm">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">Handcrafting</p>
                            <p className="text-xs text-stone-600">Traditional techniques</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                            <span className="text-orange-700 font-bold text-sm">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">Finishing</p>
                            <p className="text-xs text-stone-600">Quality perfection</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Artisan Legacy Section */}
                    {product.artisanInfo && (
                      <div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-symbols-outlined text-orange-600">groups</span>
                          <h3 className="text-lg font-semibold text-stone-800">Artisan Legacy</h3>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          <div className="w-16 h-16 bg-orange-200 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={product.artisanInfo.profilePhotoUrl || '/placeholder-avatar.svg'}
                              alt={product.artisanInfo.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/placeholder-avatar.svg';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-stone-700 leading-relaxed">
                              <strong className="text-orange-600">{product.artisanInfo.name}</strong> continues a family tradition that spans generations. 
                              Their dedication to preserving traditional methods while embracing innovation ensures that each piece maintains 
                              its authentic character while meeting contemporary standards of excellence.
                            </p>
                            {product.artisanInfo.verified && (
                              <div className="flex items-center gap-1 mt-2 text-green-600">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                <span className="text-sm font-medium">Verified Master Artisan</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cultural Impact Section */}
                    <div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-orange-600">public</span>
                        <h3 className="text-lg font-semibold text-stone-800">Cultural Impact & Legacy</h3>
                      </div>
                      <p className="text-stone-700 leading-relaxed mb-4">
                        Beyond its aesthetic appeal, this craft represents a living tradition that supports local communities and preserves 
                        invaluable cultural knowledge. By choosing this piece, you become part of a movement that values authenticity, 
                        sustainability, and the continuation of ancestral wisdom.
                      </p>
                      
                      {/* Impact Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">200+</p>
                          <p className="text-xs text-stone-600">Years of Tradition</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">50+</p>
                          <p className="text-xs text-stone-600">Families Supported</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">100%</p>
                          <p className="text-xs text-stone-600">Handmade</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">Eco</p>
                          <p className="text-xs text-stone-600">Sustainable</p>
                        </div>
                      </div>
                    </div>

                    {/* Story Media Gallery */}
                    {(product.productStory?.storyMediaUrls?.length > 0 || product.images?.length > 1) && (
                      <div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="material-symbols-outlined text-orange-600">photo_library</span>
                          <h3 className="text-lg font-semibold text-stone-800">Behind the Scenes</h3>
                        </div>
                        <p className="text-stone-600 text-sm mb-4">
                          Explore the making process and cultural context through these exclusive images
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(product.productStory?.storyMediaUrls || product.images?.slice(1, 4) || []).map((mediaUrl, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-lg bg-stone-100">
                              <div className="aspect-video w-full overflow-hidden">
                                <img
                                  src={mediaUrl}
                                  alt={`Story media ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-image.svg';
                                  }}
                                />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-2 left-2 right-2">
                                  <p className="text-white text-xs">
                                    {index === 0 && "Traditional crafting methods in action"}
                                    {index === 1 && "The artisan workspace and tools"}
                                    {index === 2 && "Cultural context and heritage"}
                                    {index > 2 && `Behind the scenes ${index + 1}`}
                                  </p>
                                </div>
                              </div>
                              <button className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="material-symbols-outlined text-white text-sm">fullscreen</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Call to Action */}
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-lg text-white text-center">
                      <h3 className="text-xl font-bold mb-2">Own a Piece of Living History</h3>
                      <p className="text-orange-100 mb-4">
                        When you purchase this item, you're not just buying a product – you're preserving a tradition and supporting the artisans who keep these ancient skills alive.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button className="px-6 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                          Learn More About Our Artisans
                        </button>
                        <button className="px-6 py-2 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                          Share This Story
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Artisan Profile */}
              {product.artisanInfo && (
                <div className="artisan-profile flex items-center gap-4 border-t border-stone-200 pt-6">
                  <div className="h-12 w-12 md:h-14 md:w-14 bg-stone-200 rounded-full border-2 border-orange-500 flex-shrink-0 overflow-hidden">
                    <img
                      src={product.artisanInfo.profilePhotoUrl || '/placeholder-avatar.svg'}
                      alt={product.artisanInfo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-avatar.svg';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-stone-800 text-base md:text-lg truncate">
                      {product.artisanInfo.name}
                    </h3>
                    {product.artisanInfo.briefBio && (
                      <p className="text-sm text-stone-500 line-clamp-2">
                        {product.artisanInfo.briefBio}
                      </p>
                    )}
                    <button className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
                      View Full Profile & Other Items
                    </button>
                  </div>
                </div>
              )}

              {/* Price and Stock */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                <span className="text-3xl md:text-4xl font-bold text-stone-900">
                  ₹{product.price?.toLocaleString() || '0'}
                </span>
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{product.availability ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  className="flex items-center justify-center gap-2 rounded-md h-12 px-6 bg-orange-500 text-white text-base font-bold shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!product.availability}
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  <span className="truncate">Add to Cart</span>
                </button>
                <button 
                  className="flex items-center justify-center rounded-md h-12 px-6 bg-stone-900 text-white text-base font-bold shadow-sm hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!product.availability}
                >
                  Buy Now
                </button>
                <button 
                  onClick={handleLike}
                  className="sm:col-span-2 flex items-center justify-center gap-2 rounded-md h-12 px-6 border border-stone-300 bg-white text-stone-700 text-base font-bold shadow-sm hover:bg-stone-100 transition-colors"
                >
                  <span className="material-symbols-outlined">favorite_border</span>
                  <span className="truncate">Add to Wishlist ({product.likes || 0})</span>
                </button>
              </div>

              {/* Product Specifications */}
              <div className="border-t border-stone-200 pt-6 mt-6">
                <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-3">
                  Product Specifications & Authenticity
                </h3>
                <ul className="space-y-2 text-sm text-stone-700">
                  {product.provenance && (
                    <li className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-100 pb-1 gap-1">
                      <span className="font-medium text-stone-600">Provenance:</span>
                      <span className="sm:text-right">{product.provenance}</span>
                    </li>
                  )}
                  {product.shippingInfo?.dimensions && (
                    <li className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-100 pb-1 gap-1">
                      <span className="font-medium text-stone-600">Dimensions:</span>
                      <span className="sm:text-right">
                        {product.shippingInfo.dimensions.height}"H x {product.shippingInfo.dimensions.width}"W x {product.shippingInfo.dimensions.depth}"D
                      </span>
                    </li>
                  )}
                  {product.craftMethod && (
                    <li className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-100 pb-1 gap-1">
                      <span className="font-medium text-stone-600">Craft Method:</span>
                      <span className="sm:text-right">{product.craftMethod}</span>
                    </li>
                  )}
                  {product.authenticityCertificateUrl && (
                    <li className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-100 pb-1 gap-1">
                      <span className="font-medium text-stone-600">Authenticity:</span>
                      <a 
                        href={product.authenticityCertificateUrl}
                        className="font-medium text-orange-500 hover:text-orange-600 transition-colors underline sm:text-right"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Digital Certificate
                      </a>
                    </li>
                  )}
                  {product.shippingInfo?.estimatedDeliveryDays && (
                    <li className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="font-medium text-stone-600">Shipping:</span>
                      <span className="text-green-600 font-semibold sm:text-right">
                        {product.shippingInfo.estimatedDeliveryDays} days delivery
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Customer Reviews Summary */}
              <div className="border-t border-stone-200 pt-6">
                <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-4">
                  Customer Reviews
                </h3>
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  <div className="flex flex-col items-center lg:items-start">
                    <p className="text-4xl md:text-5xl font-black text-stone-800">
                      {product.rating?.average?.toFixed(1) || '0.0'}
                    </p>
                    <div className="flex gap-0.5 text-yellow-500 mt-1">
                      {renderStars(product.rating?.average || 0)}
                    </div>
                    <p className="text-sm text-stone-500 mt-1">
                      Based on {product.rating?.count || 0} reviews
                    </p>
                  </div>
                  
                  {/* Rating Distribution - Simplified for mobile */}
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-stone-600 w-4">
                          {star}
                        </span>
                        <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                          <div 
                            className="rounded-full bg-yellow-500" 
                            style={{ width: `${Math.random() * 80}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-stone-500 w-12 text-right">
                          {Math.floor(Math.random() * 40)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 lg:mt-16">
            <div className="border-b border-stone-200">
              <nav className="-mb-px flex gap-4 lg:gap-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium transition-colors ${
                    activeTab === 'qa'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
                  }`}
                >
                  Q&A
                </button>
              </nav>
            </div>

            {/* Reviews Content */}
            {activeTab === 'reviews' && (
              <div className="divide-y divide-stone-200 mt-8">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="py-6 lg:py-8">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-stone-200 rounded-full flex-shrink-0 overflow-hidden">
                          <img
                            src={review.user?.profilePhotoUrl || '/placeholder-avatar.svg'}
                            alt={review.user?.name || 'User'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-avatar.svg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                            <div>
                              <p className="text-base font-medium text-stone-900">
                                {review.user?.name || 'Anonymous User'}
                              </p>
                              <div className="flex items-center mt-1 gap-0.5 text-yellow-500">
                                {renderStars(review.rating, 'text-base')}
                              </div>
                            </div>
                            <p className="text-sm text-stone-500">
                              {review.date ? new Date(review.date).toLocaleDateString() : 'No date'}
                            </p>
                          </div>
                          <p className="text-stone-600 mt-3 text-sm lg:text-base">
                            {review.comment || 'No comment provided.'}
                          </p>
                          <div className="flex gap-4 text-stone-500 mt-3">
                            <button className="flex items-center gap-1.5 text-sm hover:text-stone-700 transition-colors">
                              <span className="material-symbols-outlined text-lg">thumb_up</span>
                              <span>{Math.floor(Math.random() * 20)}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-sm hover:text-stone-700 transition-colors">
                              <span className="material-symbols-outlined text-lg">thumb_down</span>
                              <span>{Math.floor(Math.random() * 5)}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-stone-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}

            {/* Q&A Content */}
            {activeTab === 'qa' && (
              <div className="py-12 text-center">
                <p className="text-stone-500">Q&A section coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
