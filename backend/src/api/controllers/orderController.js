import Order from '../../models/Order.js';
import ArtisanProduct from '../../models/ArtisanProduct.js';

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

    // Check if user owns this order
    if (order.user._id.toString() !== req.user.id) {
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

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
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

    // Find all products belonging to this artisan
    const artisanProducts = await ArtisanProduct.find({ artisan: req.user.id }).select('_id');
    const artisanProductIds = artisanProducts.map(p => p._id.toString());

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
      'items.productId': { $in: artisanProductIds },
      'items.productType': 'artisan'
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
