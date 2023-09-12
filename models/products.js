const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  colors: [{
    type: String,
  }],
  images: [{
    type: String,
  }],
});

const productMasterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  description: {
    type: String,
  },
  shipping: {
    type: Boolean,
  }
});

const ProductDetails = mongoose.model('productdetails', productDetailsSchema);
const ProductMaster = mongoose.model('productmaster', productMasterSchema);

module.exports = {
  ProductDetails,
  ProductMaster,
};
