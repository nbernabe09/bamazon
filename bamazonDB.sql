DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  product_name VARCHAR(64) NOT NULL,
  department_name VARCHAR(64) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL
);

INSERT INTO products (
  product_name,
  department_name,
  price,
  stock_quantity
)
VALUES (
  "Nintendo Switch",
  "Electronics",
  299.99,
  5
),(
  "Men's Aloha Shirt",
  "Clothing, Shoes & Jewelry",
  29.99,
  121
),(
  "Grumpy Cat Plush",
  "Toys & Games",
  15.91,
  73
),(
  "Wrecking Ball by Miley Cyrus",
  "Music, Movies & TV",
  1.29,
  999
),(
  "Spalding NBA Street Basketball",
  "Sports & Outdoors",
  29.95,
  23
),(
  "STANLEY All-In-One Screwdriver",
  "Tools & Home Improvement",
  3.50,
  75
),(
  "WizGear Magnetic Phone Mount",
  "Automotive Parts",
  18.99,
  22
),(
  "Feng Shui Brass Elegant Elephant",
  "Collectibles & Fine Art",
  10.99,
  1
),(
  "Bath & Body Works Pearberry Lotion",
  "Beauty & Personal Care",
  8.15,
  30
),(
  "JavaPresse Manual Coffee Grinder",
  "Home & Kitchen",
  59.99,
  148
);