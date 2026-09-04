const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

// Maps the `sort` query value to a Mongoose sort spec.
const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  "name-asc": { name: 1 },
  "name-desc": { name: -1 },
  "rating-desc": { rating: -1 },
};

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 50;

const normalizeCategory = (value) =>
  String(value || "").trim().replace(/\s+/g, " ");

const ensureCategoryExists = async (categoryName) => {
  const normalizedCategory = normalizeCategory(categoryName);
  if (!normalizedCategory) {
    return false;
  }

  const category = await Category.findOne({
    name: { $regex: `^${normalizedCategory.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
  });

  return category ? category.name : false;
};

// GET /api/products
// Supports: keyword, category, brand, minPrice, maxPrice, sort, page, limit
const getProducts = async (req, res) => {
  try {
    const {
      keyword = "",
      category = "",
      brand = "",
      minPrice = "",
      maxPrice = "",
      sort = "newest",
      page = 1,
      limit = DEFAULT_LIMIT,
    } = req.query;

    const filter = {};

    if (String(keyword).trim()) {
      filter.name = { $regex: String(keyword).trim(), $options: "i" };
    }
    if (String(category).trim()) {
      filter.category = String(category).trim();
    }
    if (String(brand).trim()) {
      filter.brand = String(brand).trim();
    }

    const priceFilter = {};
    if (minPrice !== "" && !Number.isNaN(Number(minPrice))) {
      priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice !== "" && !Number.isNaN(Number(maxPrice))) {
      priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
      filter.price = priceFilter;
    }

    const sortSpec = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

    const pageNum = Math.max(1, Number(page) || 1);
    const perPage = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || DEFAULT_LIMIT));
    const skip = (pageNum - 1) * perPage;

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortSpec).skip(skip).limit(perPage),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      page: pageNum,
      pages: Math.ceil(total / perPage) || 1,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/products/meta -> distinct categories & brands, for building filter UI
const getProductMeta = async (req, res) => {
  try {
    const [categories, brands] = await Promise.all([
      Category.find({}).sort({ name: 1 }).select("name -_id"),
      Product.distinct("brand"),
    ]);

    res.json({
      categories: categories.map((category) => category.name).filter(Boolean),
      brands: brands.filter(Boolean).sort(),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const EDITABLE_FIELDS = [
  "name",
  "description",
  "price",
  "category",
  "brand",
  "countInStock",
  "image",
  "rating",
];

// POST /api/products  (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || price === undefined || price === "" || !category) {
      return res
        .status(400)
        .json({ message: "Name, price and category are required" });
    }

    const validCategoryName = await ensureCategoryExists(category);
    if (!validCategoryName) {
      return res.status(400).json({ message: "Valid category is required" });
    }

    const payload = { createdBy: req.user._id };
    EDITABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        payload[field] = field === "category" ? validCategoryName : req.body[field];
      }
    });

    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/products/:id  (admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let validCategoryName = null;
    if (req.body.category !== undefined) {
      validCategoryName = await ensureCategoryExists(req.body.category);
      if (!validCategoryName) {
        return res.status(400).json({ message: "Valid category is required" });
      }
    }

    EDITABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = field === "category" ? validCategoryName : req.body[field];
      }
    });

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/products/:id  (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductMeta,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
