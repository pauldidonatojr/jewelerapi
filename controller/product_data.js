// productController.js
const { ProductMaster } = require('../models/products'); // Import your models

// Define the getAllProducts function
async function getAllProducts() {
    try {
        const result = await ProductMaster.find();
        console.log(result)
      } catch (err) {
        res.status(500).send(err);
      }
}

module.exports = {
  getAllProducts, // Export the getAllProducts function
};
