const UserSignupsChart = ({ totalUsers, period, change, data = [50, 70, 40, 90] }) => {
  return (
    <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#e7d9cf] dark:border-[#3f2e1e] p-6 bg-white dark:bg-[#2a1e14]">
      <p className="text-base font-medium">User Signups</p>
      <p className="text-4xl font-bold leading-tight tracking-tight truncate">{totalUsers}</p>
      <div className="flex gap-1">
        <p className="text-[#9a6c4c] dark:text-[#a88e79] text-sm font-normal">{period}</p>
        <p className="text-[#07880e] text-sm font-medium">{change}</p>
      </div>
      <div className="grid min-h-[200px] grid-flow-col gap-6 grid-rows-[1fr] items-end justify-items-center px-3 pt-8">
        {data.map((height, index) => (
          <div
            key={index}
            className={`w-full rounded-t-lg ${
              index === data.length - 1 ? 'bg-[#ec6d13]' : 'bg-[#ec6d13]/20'
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default UserSignupsChart;
