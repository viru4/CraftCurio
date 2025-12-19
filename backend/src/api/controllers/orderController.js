import Order from '../../models/Order.js';
import ArtisanProduct from '../../models/ArtisanProduct.js';
import Artisan from '../../models/Artisan.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, subtotal, shipping, tax, total, paymentMethod, notes } = req.body;
    
    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Validate shipping address fields
    const requiredAddressFields = ['fullName', 'address', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({ 
          message: `Shipping address is missing required field: ${field}` 
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || 'card',
      notes
    });

    await order.save();

    // Populate user details
    await order.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create order',
      error: error.message 
    });
  }
};

// Get all orders for logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Check if user is allowed to view this order
    // Buyers can see their own orders; admins and artisans can see orders relevant to them
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'artisan') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this order' 
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch order',
      error: error.message 
    });
  }
};

// Update order status (admin functionality)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    
    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update order',
      error: error.message 
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    order.paymentStatus = paymentStatus;
    
    if (paymentStatus === 'paid') {
      order.orderStatus = 'confirmed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update payment status',
      error: error.message 
    });
  }
};

// Update order shipping address
export const updateOrderShippingAddress = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.shippingAddress = shippingAddress;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Shipping address updated successfully',
      order
    });
  } catch (error) {
    console.error('Update shipping address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shipping address',
      error: error.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to cancel this order' 
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot cancel order that has been shipped or delivered' 
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cancel order',
      error: error.message 
    });
  }
};

// Get all orders (admin only) with filters, stats, and pagination
export const getAllOrders = async (req, res) => {
  try {
    const { 
      status, 
      paymentStatus, 
      search, 
      dateFrom, 
      dateTo, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Add status filter
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    // Add payment status filter
    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    // Add search filter (order number, customer name, email)
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
      ];
    }

    // Add date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    // Count total matching orders
    const total = await Order.countDocuments(query);

    // Build sort config
    const sortConfig = {};
    sortConfig[sortBy] = order === 'desc' ? -1 : 1;

    // Fetch paginated orders
    const orders = await Order.find(query)
      .sort(sortConfig)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('user', 'name email phone');

    // Calculate stats
    const stats = await Order.aggregate([
      {
        $facet: {
          statusCounts: [
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
          ],
          paymentCounts: [
            { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
          ],
          totalRevenue: [
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ],
          recentOrders: [
            { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    // Format stats
    const formattedStats = {
      total: total,
      byStatus: stats[0].statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byPayment: stats[0].paymentCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      totalRevenue: stats[0].totalRevenue[0]?.total || 0,
      last30Days: stats[0].recentOrders[0]?.count || 0
    };

    res.status(200).json({
      success: true,
      data: {
        orders,
        stats: formattedStats,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
};

// Get artisan's orders (orders containing artisan's products)
export const getArtisanOrders = async (req, res) => {
  try {
    const { status, search, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

    // Resolve artisan identity
    // req.user.id is the User _id; map it to the corresponding Artisan record
    let artisanIds = [];

    try {
      const artisanDocs = await Artisan.find({ userId: req.user.id }).select('id');
      artisanIds = artisanDocs.map(a => a.id);
    } catch (err) {
      console.error('Error resolving artisan from user:', err);
    }

    if (artisanIds.length === 0) {
      return res.status(200).json({
        success: true,
        orders: [],
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: 0
      });
    }

    // Find all products belonging to this artisan (by artisanInfo.id)
    const artisanProducts = await ArtisanProduct.find({ 'artisanInfo.id': { $in: artisanIds } }).select('_id id');
    const artisanProductIds = artisanProducts.map(p => p._id.toString());
    const artisanProductCustomIds = artisanProducts
      .map(p => p.id)
      .filter((val) => !!val)
      .map((val) => val.toString());

    const productIdSet = [...new Set([...artisanProductIds, ...artisanProductCustomIds])];

    if (artisanProductIds.length === 0) {
      return res.status(200).json({
        success: true,
        orders: [],
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: 0
      });
    }

    // Build query to find orders containing artisan's products
    const query = {
      'items.productId': { $in: productIdSet },
      // For artisan products in orders, productType is stored as 'artisan-product'
      'items.productType': 'artisan-product'
    };

    // Add status filter
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    // Add search filter (order number or customer name)
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
      ];
    }

    // Add date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    // Count total matching orders
    const total = await Order.countDocuments(query);

    // Fetch paginated orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      orders,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get artisan orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
};

// Bulk update order status (admin only)
export const bulkUpdateOrders = async (req, res) => {
  try {
    const { orderIds, updates } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order IDs array is required'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates object is required'
      });
    }

    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: updates }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} orders updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update orders',
      error: error.message
    });
  }
};
