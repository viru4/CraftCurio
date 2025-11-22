import { Package } from 'lucide-react';

const OrdersHeader = () => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#ec6d13] rounded-lg">
          <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1b130d] dark:text-[#f3ece7]">
          Orders Management
        </h1>
      </div>
      <p className="text-sm sm:text-base text-[#9a6c4c] dark:text-[#a88e79] ml-14">
        Manage and track all orders for your products
      </p>
    </div>
  );
};

export default OrdersHeader;
