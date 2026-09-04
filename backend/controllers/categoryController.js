const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

const normalizeName = (value) => String(value || "").trim().replace(/\s+/g, " ");

// GET /api/categories
const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/categories/:id
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/categories
const createCategory = async (req, res) => {
  try {
    const name = normalizeName(req.body.name);
    const description = String(req.body.description || "").trim();

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({
      name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const nextName =
      req.body.name === undefined ? category.name : normalizeName(req.body.name);
    const nextDescription =
      req.body.description === undefined
        ? category.description
        : String(req.body.description || "").trim();

    if (!nextName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const duplicate = await Category.findOne({
      _id: { $ne: category._id },
      name: { $regex: `^${nextName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });
    if (duplicate) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const previousName = category.name;
    category.name = nextName;
    category.description = nextDescription;
    await category.save();

    if (previousName !== nextName) {
      await Product.updateMany(
        { category: previousName },
        { $set: { category: nextName } }
      );
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      return res.status(400).json({
        message: "Category is in use by products and cannot be removed",
      });
    }

    await category.deleteOne();
    res.json({ message: "Category removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
