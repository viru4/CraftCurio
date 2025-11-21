const StatsCard = ({ title, value, change, isPositive = true }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#2a1e14]">
      <p className="text-base font-medium">{title}</p>
      <p className="text-3xl font-bold leading-tight tracking-tight">{value}</p>
      <p className={`text-sm font-medium leading-normal ${
        isPositive ? 'text-[#07880e]' : 'text-[#e71008]'
      }`}>
        {change}
      </p>
    </div>
  );
};

export default StatsCard;
