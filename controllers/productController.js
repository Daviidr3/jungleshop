const Product = require('../models/productModel');
const db = require('better-sqlite3')('./databases/jungle.db');

// Get all products can be filtered by category
exports.getAllProducts = (req, res) => {
    try {
        const categoryId = req.query['category-id']; // Get category ID from query parameters

        let stmt;
        if (categoryId) {
            // Filter products by category ID
            stmt = db.prepare(`
                SELECT p.*, c.name AS category 
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE p.category_id = ?
            `);
            const products = stmt.all(categoryId);
            res.status(200).json(products);
        } else {
            // Get all products with category names
            stmt = db.prepare(`
                SELECT p.*, c.name AS category 
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
            `);
            const products = stmt.all();
            res.status(200).json(products);
        }
    } catch (err) {
        console.error('Error retrieving products:', err.message);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
};

// Get a product by ID
exports.getProductById = (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT p.*, c.name AS category 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.product_id = ?
        `);
        const product = stmt.get(req.params.id); // `id` is passed in the route
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        console.error('Error retrieving product:', err.message);
        res.status(500).json({ error: 'Failed to retrieve product' });
    }
};

// Create a new product
exports.createProduct = (req, res) => {
    try {
        const { name, description, image_url, price, category_id, is_featured } = req.body;
        if (!name || !price || !image_url || !category_id) {
            return res.status(400).json({ error: 'Name, price, image URL, and category ID are required.' });
        }

        const stmt = db.prepare(`
            INSERT INTO products (name, description, image_url, price, category_id, is_featured)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(name, description, image_url, price, category_id, is_featured || 0);

        res.status(201).json({ product_id: result.lastInsertRowid, message: 'Product created successfully.' });
    } catch (err) {
        console.error('Error creating product:', err.message);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

// Update an existing product
exports.updateProduct = (req, res) => {
    try {
        const { name, description, image_url, price, category_id, is_featured } = req.body;
        if (!name || !price || !image_url || !category_id) {
            return res.status(400).json({ error: 'Name, price, image URL, and category ID are required.' });
        }

        const stmt = db.prepare(`
            UPDATE products
            SET name = ?, description = ?, image_url = ?, price = ?, category_id = ?, is_featured = ?
            WHERE product_id = ?
        `);
        const result = stmt.run(name, description, image_url, price, category_id, is_featured || 0, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product updated successfully.' });
    } catch (err) {
        console.error('Error updating product:', err.message);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// Delete a product
exports.deleteProduct = (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM products WHERE product_id = ?');
        const result = stmt.run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
