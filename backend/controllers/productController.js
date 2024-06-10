const Product = require('../models/Product');
const { isValidObjectId } = require('mongoose');


// Récupérer tous les produits pour l'affichage sur la page d'accueil
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits :', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Récupérer un produit par ID

const getProductsById = async (req, res) => {
  const { id } = req.params;
  
  // Check if the id is a valid ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Produit non trouvé' });
    }
  } catch (err) {
    console.error('Erreur lors de la récupération du produit :', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Récupérer les catégories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

//admin
// Récupérer les produits créés par l'administrateur connecté
const getProductsByAdmin = async (req, res) => {
  try {
    // Check if user is authenticated and has an ID
    if (!req.user || !req.user._id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const adminId = req.user._id;

    console.log('Admin ID:', adminId); // Log to verify adminId

    const products = await Product.find({ createdBy: adminId });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Ajouter un produit
const addProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied.');
  }
  try {
    const newProduct = new Product({
      ...req.body,
      createdBy: req.user._id
    });
    const savedProduct = await newProduct.save();
    res.status(201).send(savedProduct);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(400).send(err.message || 'Bad Request');
  }
};

// Mettre à jour un produit
const updateProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Accès refusé.');
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedProduct);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Supprimer un produit
const deleteProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Accès refusé.');
  }

  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'produit supprime' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getProducts, getProductsById, getCategories, getProductsByAdmin, addProduct, updateProduct, deleteProduct };
