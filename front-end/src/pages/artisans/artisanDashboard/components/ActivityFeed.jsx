import React from 'react';
import { Heart, Eye, Star, DollarSign } from 'lucide-react';

const ActivityItem = ({ message, time, icon: IconComponent, iconBg, iconColor }) => {
  return (
    <div className="flex items-start gap-4">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconBg} flex-shrink-0`}>
        <IconComponent className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-900">{message}</p>
        <p className="text-xs text-stone-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities = [] }) => {
  // Default activities if none provided
  const defaultActivities = [
    {
      type: 'like',
      message: 'New like on Hand-carved Bowl',
      time: '2 minutes ago',
      icon: Heart,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500'
    },
    {
      type: 'view',
      message: '5 new views on your shop',
      time: '15 minutes ago',
      icon: Eye,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500'
    },
    {
      type: 'review',
      message: 'New 5-star review',
      time: '1 hour ago',
      icon: Star,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500'
    },
    {
      type: 'sale',
      message: 'Sale: Woven Blanket for $75',
      time: '3 hours ago',
      icon: DollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="col-span-1 flex flex-col gap-4 rounded-xl border border-stone-200 p-6 bg-white">
      <p className="text-stone-900 text-lg font-medium">Latest Activity</p>
      <div className="flex flex-col gap-4">
        {displayActivities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
