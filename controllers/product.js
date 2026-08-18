const productsRouter = require('express').Router();
const Product = require('../models/product'); // 1. Importar el Modelo

// GET
productsRouter.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// POST
productsRouter.post('/', async (req, res) => {
  try {
    const { title, price, image, category, sizes, description } = req.body;

    const product = new Product({
      title,
      price,
      image,
      category,
      sizes,
      description
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error saving product", error });
  }
});

// DELETE
productsRouter.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

module.exports = productsRouter;