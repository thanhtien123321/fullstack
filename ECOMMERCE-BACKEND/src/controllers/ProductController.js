// --- BACKEND: controllers/ProductController.js ---

const ProductService = require('../services/ProductService')
const Product = require('../models/ProductModel')

const createProduct = async (req, res) => {
    try {
      const { name, price, description, rating, type, countInStock } = req.body;
      const imageFile = req.file;
  
      if (!name || !price || !description || !rating || !imageFile || !type || !countInStock) {
        return res.status(400).json({ status: 'ERR', message: 'Missing required fields' });
      }
  
      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        return res.status(409).json({ status: 'ERR', message: 'Tên sản phẩm đã tồn tại' });
      }
  
      
      const imagePath = `/uploads/${imageFile.filename}`;
  
      const newProduct = new Product({
        name,
        price,
        description,
        rating,
        type,
        countInStock,
        image: imagePath, // ✅ lưu đường dẫn
      });
  
      const savedProduct = await newProduct.save();
  
      return res.status(201).json({
        status: 'OK',
        message: 'Tạo sản phẩm thành công!',
        data: savedProduct,
      });
    } catch (error) {
      return res.status(500).json({ status: 'ERR', message: error.message });
    }
  };
  

  const updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const updatedFields = req.body;
      if (req.file) {
        updatedFields.image = `/uploads/${req.file.filename}`;
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });
  
      res.json({
        status: 'ok',
        message: 'success',
        data: updatedProduct
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  };
  
  

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) return res.status(400).json({ status: 'ERR', message: 'Product ID is required' });

        const response = await ProductService.getDetailsProduct(productId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(500).json({ message: e.message || String(e) });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) return res.status(400).json({ status: 'ERR', message: 'Product ID is required' });

        const response = await ProductService.deleteProduct(productId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(500).json({ message: e.message || String(e) });
    }
};

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!ids) return res.status(400).json({ status: 'ERR', message: 'IDs are required' });

        const response = await ProductService.deleteManyProduct(ids);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(500).json({ message: e.message || String(e) });
    }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, name, type } = req.query;

    const response = await ProductService.getAllProduct(
      Number(limit) || 0,
      Number(page) || 0,
      sort,
      { name, type } // truyền object filter
    );

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message || String(e) });
  }
};



const getAllType = async (req, res) => {
  try {
     const response = await ProductService.getAllType();
     return res.status(200).json(response);
  } catch (e) {
      return res.status(500).json({ message: e.message || String(e) });
  }
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteMany,
    getAllType
};
