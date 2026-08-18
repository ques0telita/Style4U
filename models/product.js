const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  imageBack: String,
  category: { type: String, enum: ['man', 'woman', 'men', 'women'] },
  sizes: [String] // Importante para que Mongoose guarde las tallas ['S', 'M', 'L']
});

module.exports = mongoose.model('Product', productSchema);