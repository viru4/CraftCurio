import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

const BulkActionsBar = ({ selectedCount, onBulkUpdate, onClear }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const statusOptions = [
    { value: 'confirmed', label: 'Confirm Orders', color: 'text-blue-600' },
    { value: 'processing', label: 'Mark Processing', color: 'text-purple-600' },
    { value: 'shipped', label: 'Mark Shipped', color: 'text-indigo-600' },
    { value: 'delivered', label: 'Mark Delivered', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancel Orders', color: 'text-red-600' }
  ];

  const handleStatusUpdate = (status) => {
    onBulkUpdate({ orderStatus: status });
    setShowStatusMenu(false);
  };

  return (
    <div className="bg-[#ec6d13] text-white rounded-lg p-4 mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle size={20} />
          <span className="font-medium">{selectedCount} order{selectedCount !== 1 ? 's' : ''} selected</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="w-full sm:w-auto px-4 py-2 bg-white text-[#1b130d] rounded-lg hover:bg-[#f8f7f6] transition-colors font-medium"
            >
              Update Status
            </button>
            
            {showStatusMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#e8d5c4] py-2 z-10">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusUpdate(option.value)}
                    className={`w-full px-4 py-2 text-left hover:bg-[#f8f7f6] transition-colors ${option.color}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClear}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear Selection"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;
