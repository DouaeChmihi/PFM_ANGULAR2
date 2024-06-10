// product.model.js

//had le fichier définira le shéma de vos produits et créera un modèle qui interagit avec la base de données mongodb 

const mongoose = require('mongoose');   // bibliothèque de modélisation de données MongoDB 

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  details: String,
  category: String,
  quantity: { type: Number, required: true, default: 0 }, // Ajout du champ quantity
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
