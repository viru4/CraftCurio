const RecentActivityTable = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA555-uWq--hdR0JdB4BMF-NGGvj8zu7KcUStxbEMs0UeZwQtQiReENev8bRYGzFb7rnyfipF_KXZvLbEWe6DhHJR7oaqvyVG1io7GdV5rbQhbB43yaFdC2e_fZmre-y3KokYfsDdNSW1uIo6wAJ2sCHxdyyldeBSb6_gys7KP4fsJ2xWRQuOWQnPfVeL4UekLqS3n_-YkbOUREJOCfVR0ZXEz_MWDgPeBnGWMwE4pUoCsH2k9K7Wmtp1_AwbUsqoK1EsIkOB5avPk'
      },
      action: 'Approved',
      actionType: 'success',
      item: 'Product #12345',
      timestamp: '2 mins ago'
    },
    {
      id: 2,
      user: {
        name: 'Michael Brown',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnjs5N9xv_VYnFn_U8h_ciXQ79wmT6BVcYarP88h4wP9EyrW790cqle2smb5p6gsVWyB5slObICPv_tikHEml0t7Kp4j7tK51WHSs_PQG0g2ekVlc_1s613Dp3wfsGZbj1DAU8SirTSLf8sKMAjLVuH-GAr2Atn2j1Y-UNUj4eiMrY-a8T8n7AZS_1J5P_4ai86Y3IhQXSgCv8pVaOrFaa8H8DoG5SERa8payTOPsT_p0V8VuPKY8aDVjB7VHOpRkr0bE_Ha0fXOc'
      },
      action: 'Updated',
      actionType: 'info',
      item: 'Order #67890',
      timestamp: '15 mins ago'
    },
    {
      id: 3,
      user: {
        name: 'Jane Smith',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmOvRGKel4PdvOGy5wlHklUrnogRGau8mNAfnZhvzCnhWP3jxy3fPenbVmaq-9zqqrti0Fyh3KEtDJ-1pz96jPewD7YpPCyAvyHdNF_kabs-mICW4qP6hz9fuvIZScXBT9P-1wZ5DmFln-FbGJ0OjvK8lAujs_lyherYeMOxWYXXdqrjdgqjin-ZA7meak2zLi-J7kuYTZFfRxeiCWe-X7VRcCfps5OL6dVzUNw2V9UG-o3A8N9y9oHLEpOCIZCTeA-XBi_IAVw_8'
      },
      action: 'Deleted',
      actionType: 'danger',
      item: "User 'Artisan Guild'",
      timestamp: '1 hour ago'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  const getBadgeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
      case 'danger':
        return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="rounded-xl border border-[#e7d9cf] dark:border-[#3f2e1e] bg-white dark:bg-[#2a1e14]">
      <div className="p-6 border-b border-[#e7d9cf] dark:border-[#3f2e1e]">
        <h2 className="text-lg font-bold">Recent Activity</h2>
        <p className="text-sm text-[#9a6c4c] dark:text-[#a88e79]">
          A log of the most recent actions taken in the dashboard.
        </p>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-[#9a6c4c] dark:text-[#a88e79]">
            <tr>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium">Item</th>
              <th className="px-6 py-3 font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {displayActivities.map((activity) => (
              <tr key={activity.id} className="border-t border-[#e7d9cf] dark:border-[#3f2e1e]">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8"
                    style={{ backgroundImage: `url('${activity.user.avatar}')` }}
                  />
                  <span className="font-medium">{activity.user.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeStyles(activity.actionType)}`}>
                    {activity.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{activity.item}</td>
                <td className="px-6 py-4 text-sm text-[#9a6c4c] dark:text-[#a88e79]">
                  {activity.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-[#e7d9cf] dark:divide-[#3f2e1e]">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
                style={{ backgroundImage: `url('${activity.user.avatar}')` }}
              />
              <div className="flex-1">
                <p className="font-medium">{activity.user.name}</p>
                <p className="text-xs text-[#9a6c4c] dark:text-[#a88e79]">{activity.timestamp}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeStyles(activity.actionType)}`}>
                {activity.action}
              </span>
              <span className="text-sm">{activity.item}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityTable;
