const SalesChart = ({ totalSales, period, change }) => {
  return (
    <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#e7d9cf] dark:border-[#3f2e1e] p-6 bg-white dark:bg-[#2a1e14]">
      <p className="text-base font-medium">Sales Over Time</p>
      <p className="text-4xl font-bold leading-tight tracking-tight truncate">{totalSales}</p>
      <div className="flex gap-1">
        <p className="text-[#9a6c4c] dark:text-[#a88e79] text-sm font-normal">{period}</p>
        <p className="text-[#07880e] text-sm font-medium">{change}</p>
      </div>
      <div className="flex min-h-[200px] flex-1 flex-col gap-8 py-4">
        <svg 
          fill="none" 
          height="100%" 
          preserveAspectRatio="none" 
          viewBox="-3 0 478 150" 
          width="100%" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" 
            fill="url(#paint0_linear_chart)"
          />
          <path 
            d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" 
            stroke="#ec6d13" 
            strokeLinecap="round" 
            strokeWidth="3"
          />
          <defs>
            <linearGradient 
              gradientUnits="userSpaceOnUse" 
              id="paint0_linear_chart" 
              x1="236" 
              x2="236" 
              y1="1" 
              y2="149"
            >
              <stop stopColor="#ec6d13" stopOpacity="0.2" />
              <stop offset="1" stopColor="#ec6d13" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default SalesChart;
