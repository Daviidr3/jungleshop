const db = require('better-sqlite3')('./databases/jungle.db');

// Get all items in a cart
exports.getCart = (req, res) => {
    const { user_id } = req.query; // Extract user_id from query params

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required to fetch the cart.' });
    }

    try {
        const cartStmt = db.prepare(`
        SELECT cp.*, p.name, p.price, p.image_url
        FROM cart_products cp
        JOIN products p ON cp.product_id = p.product_id
        WHERE cp.cart_id = (SELECT cart_id FROM carts WHERE user_id = ? AND status = 'new')
    `);

        const cartItems = cartStmt.all(user_id);

        res.status(200).json(cartItems);
    } catch (err) {
        console.error('Error fetching cart:', err.message);
        res.status(500).json({ error: 'Failed to retrieve cart.' });
    }
};

// Add an item to a cart
exports.addToCart = (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ error: 'User ID, product ID, and quantity are required.' });
    }

    try {
        // Find the user's active cart
        const cartStmt = db.prepare('SELECT cart_id FROM carts WHERE user_id = ? AND status = \'new\'');
        const cart = cartStmt.get(user_id);

        if (!cart) {
            return res.status(404).json({ error: 'No active cart found for this user.' });
        }

        // Check if the product is already in the cart
        const cartProductStmt = db.prepare('SELECT * FROM cart_products WHERE cart_id = ? AND product_id = ?');
        const existingCartProduct = cartProductStmt.get(cart.cart_id, product_id);

        if (existingCartProduct) {
            // Update the quantity if the product is already in the cart
            const updateCartProductStmt = db.prepare('UPDATE cart_products SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?');
            updateCartProductStmt.run(quantity, cart.cart_id, product_id);
        } else {
            // Insert the product into the cart
            const insertCartProductStmt = db.prepare('INSERT INTO cart_products (cart_id, product_id, quantity) VALUES (?, ?, ?)');
            insertCartProductStmt.run(cart.cart_id, product_id, quantity);
        }

        res.status(201).json({ message: 'Product added to cart successfully.' });
    } catch (err) {
        console.error('Error adding to cart:', err.message);
        res.status(500).json({ error: 'Failed to add product to cart.' });
    }
};

// Update the quantity of a cart item
exports.updateCartItem = (req, res) => {
    const { id } = req.params; // Extract cart_product_id from request params
    const { quantity } = req.body; // Extract quantity from request body

    if (!id || !quantity || quantity < 1) {
        return res.status(400).json({ error: 'Valid cart item ID and quantity are required.' });
    }

    try {
        const updateCartItemStmt = db.prepare('UPDATE cart_products SET quantity = ? WHERE cart_product_id = ?');
        const result = updateCartItemStmt.run(quantity, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Cart item not found.' });
        }

        res.status(200).json({ message: 'Cart item updated successfully.' });
    } catch (err) {
        console.error('Error updating cart item:', err.message);
        res.status(500).json({ error: 'Failed to update cart item.' });
    }
};

// Remove an item from the cart
exports.removeCartItem = (req, res) => {
    const { id } = req.params; // Extract cart_product_id from request params

    if (!id) {
        return res.status(400).json({ error: 'Cart item ID is required.' });
    }

    try {
        const deleteCartItemStmt = db.prepare('DELETE FROM cart_products WHERE cart_product_id = ?');
        const result = deleteCartItemStmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Cart item not found.' });
        }

        res.status(200).json({ message: 'Cart item removed successfully.' });
    } catch (err) {
        console.error('Error removing cart item:', err.message);
        res.status(500).json({ error: 'Failed to remove cart item.' });
    }
};
exports.checkout = (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const cartStmt = db.prepare(`
            SELECT cp.quantity, p.price
            FROM cart_products cp
            JOIN products p ON cp.product_id = p.product_id
            WHERE cp.cart_id = (SELECT cart_id FROM carts WHERE user_id = ? AND status = 'new')
        `);

        const cartItems = cartStmt.all(user_id);

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty.' });
        }

        const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const tax = subtotal * 0.0675;
        const deliveryFee = 5.0;
        const total = subtotal + tax + deliveryFee;

        // Clear the cart
        const clearCartStmt = db.prepare(`
            DELETE FROM cart_products WHERE cart_id = (SELECT cart_id FROM carts WHERE user_id = ? AND status = 'new')
        `);
        clearCartStmt.run(user_id);

        res.status(200).json({ message: 'Purchase completed successfully.', total });
    } catch (err) {
        console.error('Error during checkout:', err.message);
        res.status(500).json({ error: 'Failed to complete purchase.' });
    }
};

