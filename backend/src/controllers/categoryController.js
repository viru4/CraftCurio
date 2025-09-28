import Category from '../models/Category.js';

export const createCategories = async (req, res) => {
  try {
    const categories = req.body.categories;
    const result = await Category.insertMany(categories);
    res.status(201).json({ 
      message: 'Categories created successfully', 
      count: result.length,
      data: result 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      message: 'Categories retrieved successfully',
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
