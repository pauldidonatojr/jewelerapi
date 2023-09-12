// products.js
const express = require('express');
const router = express.Router();
const productController = require('../controller/product_data');

// Define a route to get all products
router.get('/products', (req, res) => {
  productController.getAllProducts(req, res); // Call the getAllProducts function
  res.json(productController);
});

module.exports = router;
