
const express = require('express');
const cartController = require('../controllers/cartController'); // Ensure this path is correct
const router = express.Router();



router.post('/add', cartController.addToCart);

// Route to get all items in the cart
router.get('/',  cartController.getCart);

// Route to clear the cart
router.delete('/clear',  cartController.clearCart);


// Route to delete an item from the cart
router.delete('/:cartItemId',  cartController.deleteFromCart);

// Route to remove quantity from a cart item
router.put('/remove-quantity/:cartItemId',cartController.removeQuantity);


// Route to add quantity to a cart item
router.put('/add-quantity/:cartItemId',  cartController.addQuantity);

// Route to check if session cart has items
router.get('/hasSessionCartItems', cartController.hasSessionCartItems);

module.exports = router;
