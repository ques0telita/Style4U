const productsRouter = require('express').Router();
const Product = require('../models/product');

// GET all products or filter by category
productsRouter.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) {
      const normalizedCategory = (category === 'men' ? 'man' : category === 'women' ? 'woman' : category).toLowerCase();
      filter = {
        category: {
          $in: [
            normalizedCategory,
            normalizedCategory === 'man' ? 'men' : 'women'
          ]
        }
      };
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// GET single product by ID
productsRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

// POST create new product
productsRouter.post('/', async (req, res) => {
  try {
    const { title, price, image, imageBack, category, sizes, description } = req.body;

    if (!title || price === undefined || !image) {
      return res.status(400).json({ message: "Title, price, and image are required" });
    }

    const normalizedCategory = (category === 'women' ? 'woman' : category === 'men' ? 'man' : category || 'man').toLowerCase();

    const product = new Product({
      title,
      price: Number(price),
      image,
      imageBack: imageBack || image,
      category: normalizedCategory,
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L'],
      description: description || 'High quality apparel.'
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error saving product", error: error.message });
  }
});

// PUT update product by ID
productsRouter.put('/:id', async (req, res) => {
  try {
    const { title, price, image, imageBack, category, sizes, description } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price: Number(price),
        image,
        imageBack,
        category,
        sizes,
        description
      },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error: error.message });
  }
});

// DELETE delete product by ID
productsRouter.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

module.exports = productsRouter;