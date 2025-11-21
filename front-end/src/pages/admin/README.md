# Admin Dashboard

A fully responsive admin dashboard for managing the CraftCurio platform.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatically adapts to system theme preferences
- **Dashboard Overview**: View key metrics at a glance
- **Navigation**: Easy-to-use sidebar navigation (desktop) and hamburger menu (mobile)
- **Real-time Stats**: Display total sales, new users, pending approvals, and open tickets
- **Data Visualization**: Interactive charts for sales trends and user signups
- **Activity Log**: Track recent actions taken in the dashboard

## Components

### AdminSidebar
Desktop sidebar navigation with links to all admin sections.

### MobileSidebar
Mobile-responsive sidebar with hamburger menu toggle.

### AdminHeader
Top navigation bar with:
- Search functionality
- Notifications button
- Help button
- User profile display

### StatsCard
Reusable card component for displaying metrics with:
- Title
- Value
- Change percentage (positive/negative)

### SalesChart
Line chart visualization for sales data over time.

### UserSignupsChart
Bar chart visualization for user signup trends.

### RecentActivityTable
Responsive table displaying recent platform activities:
- Desktop: Full table view
- Mobile: Card-based layout
- Colored badges for action types (Approved, Updated, Deleted)

## Usage

Access the admin dashboard at `/admin`.

### Navigation Structure

- **Dashboard** - Main overview page
- **Users** - User management
- **Products** - Product catalog management
- **Orders** - Order processing and tracking
- **Content** - Content management
- **Analytics** - Advanced analytics and reports
- **Security** - Security settings and logs
- **Support** - Customer support tickets
- **Settings** - Platform configuration
- **Log Out** - Sign out of admin panel

## Future Enhancements

When backend endpoints are ready, update the `useEffect` in `Admin.jsx`:

```javascript
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const statsResponse = await fetch('/api/admin/stats');
      const activitiesResponse = await fetch('/api/admin/activities');
      
      const statsData = await statsResponse.json();
      const activitiesData = await activitiesResponse.json();
      
      setStats(statsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };
  
  fetchDashboardData();
}, []);
```

## Styling

Uses Tailwind CSS with custom color scheme:
- Primary: `#ec6d13` (brand orange)
- Success: `#07880e` (green)
- Danger: `#e71008` (red)
- Light theme backgrounds and borders
- Dark theme with warm, earthy tones

## Responsive Breakpoints

- Mobile: < 768px (hamburger menu, stacked cards, mobile table view)
- Tablet: 768px - 1024px (2-column stats grid)
- Desktop: > 1024px (full sidebar, 4-column stats grid)
