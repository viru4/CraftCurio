import React from 'react';

/**
 * ProductStorySection Component
 * Displays the comprehensive story behind the product including heritage, crafting journey, and cultural impact
 * @param {Object} product - Product object with story details
 */
const ProductStorySection = ({ product }) => {
  if (!product) return null;

  const storyText = product.productStory?.storyText || product.craftingStory || product.history ||
    `This ${product.title.toLowerCase()} represents centuries of traditional craftsmanship passed down through generations. Each piece tells a story of cultural preservation and artistic excellence, embodying the rich heritage of ${product.provenance?.split(',')[1]?.trim() || product.specifications?.origin || 'traditional artisanship'}.`;

  const craftMethod = product.craftMethod || product.specifications?.material
    ? `${product.specifications?.material ? `Crafted from ${product.specifications.material}, t` : 'T'}his piece showcases the meticulous attention to detail that defines traditional craftsmanship. Every element is carefully shaped ${product.artisanInfo ? 'by skilled hands' : ''}, preserving methods that have been refined over generations.`
    : `Created using time-honored techniques, this piece showcases the meticulous attention to detail that defines traditional craftsmanship. Every element is carefully shaped by skilled hands, preserving methods that have been refined over generations.`;

  const storyMedia = product.productStory?.storyMediaUrls || product.images?.slice(1, 4) || [];

  return (
    <section className="product-story bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-100 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-3xl text-orange-600">auto_stories</span>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
            {product.artisanInfo ? 'The Story Behind This Craft' : 'The Story Behind This Item'}
          </h2>
        </div>
        
        {/* Story Content */}
        <div className="space-y-6">
          {/* Cultural Heritage Story */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-orange-600">history_edu</span>
              <h3 className="text-xl font-bold text-stone-800">The Story Behind This Masterpiece</h3>
            </div>
            
            <div className="prose prose-stone max-w-none">
              <p className="text-stone-700 leading-relaxed text-base mb-4 font-medium first-letter:text-4xl first-letter:font-bold first-letter:text-orange-600 first-letter:mr-1 first-letter:float-left first-letter:leading-none first-letter:mt-1">
                {storyText}
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
                  <p className="text-stone-600 text-sm">{product.provenance || product.specifications?.origin || 'Traditional artisan regions of India'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-orange-600 text-lg">schedule</span>
                </div>
                <div>
                  <p className="font-semibold text-stone-800 mb-1">Heritage</p>
                  <p className="text-stone-600 text-sm">
                    {product.specifications?.yearMade 
                      ? `${product.specifications.yearMade} - Vintage collectible`
                      : 'Centuries-old tradition preserved through generations'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Crafting Journey - Only for Artisan Products */}
          {product.artisanInfo && (
            <div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-orange-600">handyman</span>
                <h3 className="text-lg font-semibold text-stone-800">The Crafting Journey</h3>
              </div>
              <p className="text-stone-700 leading-relaxed mb-4">
                {craftMethod}
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
          )}

          {/* Artisan Legacy */}
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

          {/* Cultural Impact - Only for Artisan Products */}
          {product.artisanInfo && (
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
          )}

          {/* Story Media Gallery */}
          {storyMedia.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-orange-600">photo_library</span>
                <h3 className="text-lg font-semibold text-stone-800">Behind the Scenes</h3>
              </div>
              <p className="text-stone-600 text-sm mb-4">
                Explore the making process and cultural context through these exclusive images
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {storyMedia.map((mediaUrl, index) => (
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
  );
};

export default ProductStorySection;
