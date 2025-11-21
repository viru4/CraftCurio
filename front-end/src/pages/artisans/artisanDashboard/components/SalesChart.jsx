import React, { useState } from 'react';

const SalesChart = ({ salesData = [] }) => {
  const [activeView, setActiveView] = useState('sales');

  // Generate SVG path from data
  const generatePath = (data) => {
    if (!data || data.length === 0) {
      return '';
    }

    const width = 478;
    const height = 150;
    const points = data.length;
    const step = width / (points - 1);

    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const range = max - min || 1;

    let path = '';
    data.forEach((point, index) => {
      const x = index * step;
      const y = height - ((point.value - min) / range) * height;
      
      if (index === 0) {
        path += `M${x} ${y}`;
      } else {
        path += ` L${x} ${y}`;
      }
    });

    return path;
  };

  // Default data if none provided
  const defaultData = [
    { day: 1, value: 109 },
    { day: 2, value: 21 },
    { day: 3, value: 41 },
    { day: 4, value: 93 },
    { day: 5, value: 33 },
    { day: 6, value: 101 },
    { day: 7, value: 61 },
    { day: 8, value: 45 },
    { day: 9, value: 121 },
    { day: 10, value: 149 },
    { day: 11, value: 1 },
    { day: 12, value: 81 },
    { day: 13, value: 129 },
    { day: 14, value: 25 }
  ];

  const displayData = salesData.length > 0 ? salesData : defaultData;
  const pathData = generatePath(displayData);

  return (
    <div className="col-span-1 lg:col-span-2 flex flex-col gap-4 rounded-xl border border-stone-200 p-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-stone-900 text-lg font-medium">Sales & Visits</p>
          <p className="text-stone-600 text-sm">Last 30 Days</p>
        </div>
        
        {/* Toggle buttons */}
        <div className="flex gap-1 p-1 rounded-lg bg-stone-50 border border-stone-200">
          <button
            onClick={() => setActiveView('sales')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeView === 'sales'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sales
          </button>
          <button
            onClick={() => setActiveView('visits')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeView === 'visits'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Visits
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-1 flex-col py-4 min-h-[250px]">
        <svg
          fill="none"
          height="100%"
          preserveAspectRatio="none"
          viewBox="-3 0 478 150"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradient fill */}
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id="paint0_linear_chart"
              x1="236"
              x2="236"
              y1="0"
              y2="150"
            >
              <stop stopColor="#ec6d13" stopOpacity="0.4" />
              <stop offset="1" stopColor="#ec6d13" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Fill area */}
          <path
            d={`${pathData} L${478} 150 L0 150 Z`}
            fill="url(#paint0_linear_chart)"
          />

          {/* Line */}
          <path
            d={pathData}
            stroke="#ec6d13"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
      </div>
    </div>
  );
};

export default SalesChart;
