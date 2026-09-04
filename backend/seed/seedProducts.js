// Populates the products collection with sample data so the list page has
// something to filter, sort and paginate through.
//   Run from the backend folder:  npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Home",
  "Sports",
  "Toys",
];
const brands = ["Acme", "Globex", "Umbrella", "Initech", "Soylent", "Stark"];
const adjectives = [
  "Classic",
  "Premium",
  "Eco",
  "Compact",
  "Deluxe",
  "Smart",
  "Portable",
  "Rustic",
];
const nouns = [
  "Widget",
  "Gadget",
  "Bottle",
  "Backpack",
  "Lamp",
  "Headphones",
  "Notebook",
  "Sneakers",
  "Chair",
  "Mug",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const buildProducts = (count) =>
  Array.from({ length: count }, (_, i) => {
    const name = `${pick(adjectives)} ${pick(nouns)} #${i + 1}`;
    return {
      name,
      description: `${name} — a quality item you'll love.`,
      price: randInt(5, 500) + 0.99,
      category: pick(categories),
      brand: pick(brands),
      countInStock: randInt(0, 100),
      image: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/300`,
      rating: randInt(0, 50) / 10,
    };
  });

const run = async () => {
  try {
    await connectDB();
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Category.insertMany(categories.map((name) => ({ name })));
    const products = buildProducts(42);
    await Product.insertMany(products);
    console.log(`Seeded ${categories.length} categories and ${products.length} products`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
