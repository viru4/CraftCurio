import React from 'react';

const PaymentBilling = ({ profileData }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold px-6 py-4 border-b border-gray-200">Payment & Billing</h2>
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Payment Methods</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl mb-2">credit_card_off</span>
                <p className="text-sm">No payment methods added yet</p>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium">
            <span className="material-symbols-outlined text-lg">add</span>
            Add Payment Method
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="font-bold text-gray-900">Billing History</h3>
          <div className="border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-sm">
                      No billing history available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="font-bold text-gray-900">Billing Address</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Default billing address</p>
            {profileData.address?.street ? (
              <div className="text-sm text-gray-900">
                <p>{profileData.address.street}</p>
                <p>{profileData.address.city}, {profileData.address.state} {profileData.address.zipCode}</p>
                <p>{profileData.address.country}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No billing address set</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentBilling;
