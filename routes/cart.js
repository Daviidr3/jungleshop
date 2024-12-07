const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get all cart items for a user
router.get('/', (req, res) => {
    if (!req.query.user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    cartController.getCart(req, res); // Ensure this matches the method in cartController
});

// Add a new item to the cart
router.post('/', (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ error: 'User ID, product ID, and quantity are required' });
    }

    cartController.addToCart(req, res);
});

// Update cart item quantity
router.put('/:id', (req, res) => {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Valid quantity is required' });
    }

    cartController.updateCartItem(req, res);
});

// Remove a cart item
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Cart item ID is required' });
    }

    cartController.removeCartItem(req, res);
});

// Complete purchase and clear cart
router.post('/checkout', (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    cartController.checkout(req, res);
});

module.exports = router;
