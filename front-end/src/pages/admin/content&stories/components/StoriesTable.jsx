import { useState } from 'react';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const StoriesTable = ({ 
  artisans, 
  loading, 
  onView, 
  onEdit, 
  onDelete,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (artisanId) => {
    setDeletingId(artisanId);
    await onDelete(artisanId);
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec6d13]"></div>
      </div>
    );
  }

  if (!artisans || artisans.length === 0) {
    return (
      <div className="bg-white dark:bg-[#2a1e14] rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] p-8 text-center">
        <p className="text-[#9a6c4c] dark:text-[#a88e79]">No artisan stories found</p>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-[#2a1e14] rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f3ece7] dark:bg-[#3a2a1d] border-b border-[#e7d9cf] dark:border-[#3f2e1e]">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                  Artisan
                </th>
                <th className="text-left px-4 py-3 text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                  Specialization
                </th>
                <th className="text-left px-4 py-3 text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                  Location
                </th>
                <th className="text-left px-4 py-3 text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                  Experience
                </th>
                <th className="text-left px-4 py-3 text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                  Story Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-bold text-[#1b130d] dark:text-[#fcfaf8]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7d9cf] dark:divide-[#3f2e1e]">
              {artisans.map((artisan) => {
                const hasStory = artisan.story && (
                  artisan.fullBio || 
                  (artisan.story.photos && artisan.story.photos.length > 0) ||
                  (artisan.story.quotes && artisan.story.quotes.length > 0)
                );

                return (
                  <tr key={artisan.id || artisan._id} className="hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d]/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={artisan.profilePhotoUrl || 'https://via.placeholder.com/40'}
                          alt={artisan.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-[#1b130d] dark:text-[#fcfaf8]">
                            {artisan.name}
                          </p>
                          <p className="text-xs text-[#9a6c4c] dark:text-[#a88e79]">
                            {artisan.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#1b130d] dark:text-[#fcfaf8]">
                      {artisan.craftSpecialization}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#9a6c4c] dark:text-[#a88e79]">
                      {artisan.location || 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#1b130d] dark:text-[#fcfaf8]">
                      {artisan.experienceYears ? `${artisan.experienceYears} years` : 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hasStory
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400'
                      }`}>
                        {hasStory ? 'Published' : 'No Story'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onView(artisan)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="View Story"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(artisan)}
                          className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                          title="Edit Story"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(artisan.id)}
                          disabled={deletingId === artisan.id}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Story"
                        >
                          {deletingId === artisan.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {artisans.map((artisan) => {
          const hasStory = artisan.story && (
            artisan.fullBio || 
            (artisan.story.photos && artisan.story.photos.length > 0) ||
            (artisan.story.quotes && artisan.story.quotes.length > 0)
          );

          return (
            <div
              key={artisan.id || artisan._id}
              className="bg-white dark:bg-[#2a1e14] rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={artisan.profilePhotoUrl || 'https://via.placeholder.com/48'}
                  alt={artisan.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1b130d] dark:text-[#fcfaf8] truncate">
                    {artisan.name}
                  </h3>
                  <p className="text-xs text-[#9a6c4c] dark:text-[#a88e79]">{artisan.id}</p>
                  <p className="text-sm text-[#9a6c4c] dark:text-[#a88e79] mt-1">
                    {artisan.craftSpecialization}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  hasStory
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400'
                }`}>
                  {hasStory ? 'Published' : 'No Story'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-[#9a6c4c] dark:text-[#a88e79]">Location</p>
                  <p className="text-[#1b130d] dark:text-[#fcfaf8] font-medium">
                    {artisan.location || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[#9a6c4c] dark:text-[#a88e79]">Experience</p>
                  <p className="text-[#1b130d] dark:text-[#fcfaf8] font-medium">
                    {artisan.experienceYears ? `${artisan.experienceYears} years` : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#e7d9cf] dark:border-[#3f2e1e]">
                <button
                  onClick={() => onView(artisan)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => onEdit(artisan)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(artisan.id)}
                  disabled={deletingId === artisan.id}
                  className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === artisan.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-[#2a1e14] rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] px-4 py-3">
          <div className="text-sm text-[#9a6c4c] dark:text-[#a88e79]">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#e7d9cf] dark:border-[#3f2e1e] hover:bg-[#f3ece7] dark:hover:bg-[#3a2a1d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesTable;
