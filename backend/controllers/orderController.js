const Order = require('./../models/Order');
const Product = require('./../models/Product');
const CartItem = require('./../models/Cart');
const { User } = require('../models/User'); 

// Récupérer toutes les commandes pour le gérant de l'app
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error('Erreur lors de la récupération des commandes :', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Récupérer les products d'un commande de l'administrateur spécifique


const getOrdersByAdmin = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Trouver tous les produits créés par cet administrateur
    const productsByAdmin = await Product.find({ createdBy: adminId }).select('_id');
    console.log('Products by admin:', productsByAdmin);
    const productIds = productsByAdmin.map(product => product._id);

    if (productIds.length === 0) {
      return res.status(200).json([]);
    }

    // Trouver tous les CartItems qui contiennent ces produits
    const cartItemsWithAdminProducts = await CartItem.find({ productId: { $in: productIds } }).select('_id productId');
    console.log('CartItems with admin products:', cartItemsWithAdminProducts);
    const cartItemIds = cartItemsWithAdminProducts.map(cartItem => cartItem._id);

    if (cartItemIds.length === 0) {
      return res.status(200).json([]);
    }

    // Trouver toutes les commandes qui contiennent ces CartItems
    const orders = await Order.find({ cartItems: { $in: cartItemIds } })
      .populate('user', 'name email')
      .populate({
        path: 'cartItems',
        populate: {
          path: 'productId',
          select: 'name price'
        }
      });

    console.log('Orders:', orders);

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des commandes.' });
  }
};


// Récupérer une commande spécifique par ID
const getOrderById = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Accès refusé.');
  }
  const { id } = req.params;
  try {
    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Commande non trouvée' });
    }
  } catch (err) {
    console.error('Erreur lors de la récupération de la commande :', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};


// Create a new order
const placeOrder = async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // If authenticated, proceed to create order
      const userId = req.user._id;
  
      // Retrieve cart items from the database based on userId
      const cartItems = await CartItem.find({ userId }).populate('productId');
  
      // Calculate total price from cart items
      let totalPrice = 0;
      for (const item of cartItems) {
        totalPrice += item.quantity * item.productId.price; 
      }
  
      const order = new Order({
        user: userId,
        cartItems,
        totalPrice,
        shippingAddress: req.body.shippingAddress,
        status: req.body.status
      });
  
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  module.exports = {

    getAllOrders,
    getOrderById,
    getOrdersByAdmin,
    placeOrder
  
  };