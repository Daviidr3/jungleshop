const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer(); // Memory storage by default

// Routes
app.use('/products', require('./routes/products')); // Product routes
app.use('/users', require('./routes/users')); // User routes
app.use('/orders', require('./routes/orders')); // Order routes
app.use('/categories', require('./routes/categories')); // Category routes
app.use('/cart', require('./routes/cart')); // Cart routes

// Bulk upload route
app.post('/admin/upload', upload.single('file-upload'), (req, res) => {
    try {
        // Parse the uploaded file content
        const fileContent = req.file.buffer.toString('utf-8');
        const products = JSON.parse(fileContent).products; // Expecting a JSON structure with "products"

        // Validate JSON structure
        products.forEach((product) => {
            if (!product.name || !product.price || !product.category_id) {
                throw new Error(
                    'Each product must have name, price, category_id, and optional description and image_url fields.'
                );
            }
        });

        // Database connection
        const db = require('better-sqlite3')('./databases/jungle.db');
        const insertProduct = db.prepare(
            'INSERT INTO products (name, price, category_id, description, image_url) VALUES (?, ?, ?, ?, ?)'
        );

        // Insert each product into the database
        products.forEach((product) => {
            insertProduct.run(
                product.name,
                product.price,
                product.category_id,
                product.description || '',
                product.image_url || '/images/default.png' // Use default image if not provided
            );
        });

        // Redirect after successful upload
        res.redirect('/admin-products.html?success=true');
    } catch (err) {
        console.error('Error processing upload:', err.message);
        res.status(400).send(
            `<script>alert('Invalid file format or content. Please try again.'); window.location.href = '/admin-upload.html';</script>`
        );
    }
});

// Default route index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
