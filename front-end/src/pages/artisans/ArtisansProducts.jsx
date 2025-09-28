import React from 'react'
import { Navbar } from '@/components/layout'

const ArtisansProducts = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold text-center mb-8">Artisan Products</h1>
        <p className="text-center text-gray-600">
          Discover unique handcrafted products from talented artisans.
        </p>
        {/* Add your artisan products content here */}
      </div>
    </>
  )
}

export default ArtisansProducts