const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const isAdmin = require('../middleware/isAdmin');


router.post('/place-order', orderController.placeOrder);

router.get('/admin/orders',isAdmin, orderController.getOrdersByAdmin); // Route pour récupérer les commandes de l'administrateur

router.get('/:id', isAdmin, orderController.getOrderById); // Route pour récupérer une commande par ID


// Get all orders pour le gérant
router.get('/', orderController.getAllOrders);



module.exports = router;
