const Product = require('./../models/Product');
const CartItem = require('./../models/Cart');
const mongoose = require('mongoose');


const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user ? req.user._id : null;
    const sessionId = req.cookies.sessionId;

    console.log('User ID:', userId); // Log to verify userId
    console.log('Session ID:', sessionId); // Log to verify sessionId


    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cartItem;
    if (userId) {
      cartItem = await CartItem.findOne({ productId, userId });
    } else {
      cartItem = await CartItem.findOne({ productId, sessionId });
    }

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cartItem = new CartItem({
        productId,
        quantity: 1,
        userId,
        sessionId: userId ? null : sessionId
      });
    }

    await cartItem.save();
    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.cookies.sessionId;

    let cartItems;
    if (userId) {
      cartItems = await CartItem.find({ userId }).populate('productId');
    } else {
      cartItems = await CartItem.find({ sessionId }).populate('productId');
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error retrieving cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.cookies.sessionId;

    if (userId) {
      await CartItem.deleteMany({ userId });
    } else {
      await CartItem.deleteMany({ sessionId });
    }

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    await CartItem.findByIdAndDelete(cartItemId);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
      res.status(200).json({ message: 'Quantity decreased' });
    } else {
      await CartItem.findByIdAndDelete(cartItemId);
      res.status(200).json({ message: 'Item removed from cart' });
    }
  } catch (error) {
    console.error('Error decreasing quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity += 1;
    await cartItem.save();
    res.status(200).json({ message: 'Quantity increased' });
  } catch (error) {
    console.error('Error increasing quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//on va utilisé cet logique dans le login pour fusionner la cart de sessionId avec la carte UserId
const mergeCartItems = async (userId, sessionId) => {
  try {
    const sessionCartItems = await CartItem.find({ sessionId });
    const userCartItems = await CartItem.find({ userId });

    // Merge session cart items with user cart items
    const mergedCartItems = [];

    sessionCartItems.forEach(sessionItem => {
      const userItem = userCartItems.find(item => item.productId.equals(sessionItem.productId));
      if (userItem) {
        userItem.quantity += sessionItem.quantity;
      } else {
        sessionItem.userId = userId;
        sessionItem.sessionId = null;
        userCartItems.push(sessionItem);
      }
    });

    await Promise.all(userCartItems.map(cartItem => cartItem.save()));

    // Optionally, delete session cart items
    await CartItem.deleteMany({ sessionId });

  } catch (error) {
    console.error('Error merging cart items:', error);
    throw new Error('Failed to merge cart items');
  }
};


//avant fusionner on va checker si sessionId has items !!!
const hasSessionCartItems = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    const sessionCartItems = await CartItem.find({ sessionId });
    const hasItems = sessionCartItems.length > 0;
    res.json(hasItems);
  } catch (error) {
    console.error('Error checking session cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addToCart,
  getCart,
  clearCart,
  deleteFromCart,
  removeQuantity,
  addQuantity,
  mergeCartItems, 
  hasSessionCartItems
};