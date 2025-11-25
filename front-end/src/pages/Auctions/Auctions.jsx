import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Footer } from '@/components/layout';
import { useLiveAuctions } from '@/hooks/useAuction';
import AuctionPage from '@/components/CollectorDashboard/AuctionPage';

/**
 * Auctions Page - Browse and view live auctions
 */
export default function Auctions() {
  const navigate = useNavigate();
  const { auctionId } = useParams();
  const { auctions, isLoading, error, pagination, fetchAuctions } = useLiveAuctions();

  // If auctionId is in URL, show that auction
  if (auctionId) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Navbar />
        <main className="flex-1 pt-16 md:pt-20">
          <AuctionPage
            auctionId={auctionId}
            onClose={() => navigate('/auctions')}
            onBuySuccess={() => {
              navigate('/my-orders');
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Show auction list
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Live Auctions</h1>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!isLoading && !error && auctions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No live auctions at the moment.</p>
              <button
                onClick={() => navigate('/collectibles')}
                className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Browse Collectibles
              </button>
            </div>
          )}

          {!isLoading && auctions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <div
                  key={auction.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/auctions/${auction.id}`)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={auction.image || '/placeholder-auction.jpg'}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Live
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {auction.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Bid</span>
                        <span className="font-bold text-primary">
                          ₹{auction.currentBid?.toLocaleString()}
                        </span>
                      </div>
                      {auction.timeRemaining && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Time Left</span>
                          <span className="font-semibold text-sm">
                            {auction.timeRemaining}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Bids</span>
                        <span className="text-sm font-medium">
                          {auction.totalBids || 0}
                        </span>
                      </div>
                    </div>
                    <button
                      className="w-full mt-4 bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/auctions/${auction.id}`);
                      }}
                    >
                      View Auction
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => fetchAuctions({ page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchAuctions({ page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
