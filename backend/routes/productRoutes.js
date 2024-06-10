// routes/productRoutes.js
const express = require('express');
const productController = require('../controllers/productController'); // Ensure this path is correct
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');

router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/admin',isAdmin, productController.getProductsByAdmin);  // Route pour récupérer les produits de l'administrateur
router.get('/:id', productController.getProductsById);
router.post('/admin/add', isAdmin, productController.addProduct);
router.put('/admin/:id', isAdmin, productController.updateProduct);
router.delete('/admin/:id', isAdmin, productController.deleteProduct);


//router.post('/', authMiddleware, addProduct);

module.exports = router;
