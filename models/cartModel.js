const Database = require('better-sqlite3');
const db = new Database('./databases/jungle.db'); // Updated database path

exports.getCartById = (cartId) => {
    const stmt = db.prepare('SELECT * FROM carts WHERE cart_id = ?');
    return stmt.get(cartId);
};

exports.getCartItems = (cartId) => {
    const stmt = db.prepare(`
        SELECT cp.cart_product_id, p.name, p.price, cp.quantity, p.image
        FROM cart_products cp
        JOIN products p ON cp.product_id = p.product_id
        WHERE cp.cart_id = ?
    `);
    return stmt.all(cartId);
};

exports.addToCart = (cartId, productId, quantity) => {
    const stmt = db.prepare(`
        INSERT INTO cart_products (cart_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON CONFLICT (cart_id, product_id)
        DO UPDATE SET quantity = quantity + ?
    `);
    stmt.run(cartId, productId, quantity, quantity);
    return { cart_id: cartId, product_id: productId, quantity };
};

exports.updateCartItem = (cartProductId, quantity) => {
    const stmt = db.prepare('UPDATE cart_products SET quantity = ? WHERE cart_product_id = ?');
    stmt.run(quantity, cartProductId);
    return { cart_product_id: cartProductId, quantity };
};

exports.removeCartItem = (cartProductId) => {
    const stmt = db.prepare('DELETE FROM cart_products WHERE cart_product_id = ?');
    stmt.run(cartProductId);
    return { cart_product_id: cartProductId };
};
