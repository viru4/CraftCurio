import React from 'react';
import { Eye, Edit, Trash2, Check, X } from 'lucide-react';

const CategoryTable = ({ categories, onApprove, onReject, onDelete, onEdit, onView }) => {

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return badges[status] || badges.pending;
  };

  const getTypeBadge = (type) => {
    const badges = {
      artisan: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      collectible: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };
    return badges[type] || badges.artisan;
  };

  const handleRejectClick = (category) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason !== null) {
      onReject(category, reason);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-[#2a1e14] rounded-lg shadow-sm border border-[#e7d9cf] dark:border-[#3f2e1e] p-12 text-center">
        <p className="text-stone-500 dark:text-stone-400">No categories found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#2a1e14] rounded-lg shadow-sm border border-[#e7d9cf] dark:border-[#3f2e1e] overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-50 dark:bg-[#221810] border-b border-[#e7d9cf] dark:border-[#3f2e1e]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Submitted By
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7d9cf] dark:divide-[#3f2e1e]">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-stone-50 dark:hover:bg-[#3a2a1d]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {category.image && (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {category.name}
                      </div>
                      {category.icon && (
                        <div className="text-xs text-stone-500 dark:text-stone-400">
                          {category.icon}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadge(category.type)}`}>
                    {category.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-stone-600 dark:text-stone-400 max-w-xs truncate">
                    {category.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(category.status)}`}>
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600 dark:text-stone-400">
                  {category.submittedBy 
                    ? `${category.submittedBy.firstName || ''} ${category.submittedBy.lastName || ''}`.trim() || category.submittedBy.email
                    : 'System'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(category)}
                      className="text-stone-600 hover:text-[#ec6d13] dark:text-stone-400 dark:hover:text-[#ec6d13]"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(category)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {category.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove(category)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRejectClick(category)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDelete(category)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {categories.map((category) => (
          <div 
            key={category._id} 
            className="p-4 border-b border-[#e7d9cf] dark:border-[#3f2e1e] last:border-b-0"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-stone-900 dark:text-stone-100">
                    {category.name}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeBadge(category.type)}`}>
                      {category.type}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(category.status)}`}>
                      {category.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
              {category.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                By: {category.submittedBy 
                  ? `${category.submittedBy.firstName || ''} ${category.submittedBy.lastName || ''}`.trim() || category.submittedBy.email
                  : 'System'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onView(category)}
                  className="p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-[#3a2a1d] rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {category.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onApprove(category)}
                      className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRejectClick(category)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => onDelete(category)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTable;
