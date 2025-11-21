import Cart from '../../models/Cart.js';
import ArtisanProduct from '../../models/ArtisanProduct.js';
import Collectible from '../../models/Collectible.js';

/**
 * Get user's cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [], total: 0 }
      });
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      data: { 
        items: cart.items.map(item => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          artisan: item.artisan,
          category: item.category,
          quantity: item.quantity,
          type: item.productType
        })),
        total 
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, productType, name, price, image, artisan, category, quantity = 1 } = req.body;

    if (!productId || !productType || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify product exists
    let productExists = false;
    if (productType === 'artisan-product') {
      productExists = await ArtisanProduct.exists({ _id: productId });
    } else if (productType === 'collectible') {
      productExists = await Collectible.exists({ _id: productId });
    }

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        items: [{
          productId,
          productType,
          name,
          price,
          image,
          artisan,
          category,
          quantity
        }]
      });
    } else {
      // Check if item already exists
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId && item.productType === productType
      );

      if (existingItemIndex !== -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          productId,
          productType,
          name,
          price,
          image,
          artisan,
          category,
          quantity
        });
      }
    }

    await cart.save();

    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: { 
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        total
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

/**
 * Update item quantity in cart
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity'
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: { 
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        total
      }
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: { 
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        total
      }
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

/**
 * Clear entire cart
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};
