const Database = require('better-sqlite3');
const db = new Database('./databases/jungle.db');

exports.getAll = () => {
    const stmt = db.prepare('SELECT * FROM products');
    return stmt.all();
};

exports.getById = (productId) => {
    const stmt = db.prepare('SELECT * FROM products WHERE product_id = ?');
    return stmt.get(productId); // Use `product_id` instead of `id`
};

exports.create = (product) => {
    const stmt = db.prepare('INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)');
    const info = stmt.run(product.name, product.description, product.price, product.image);
    return { product_id: info.lastInsertRowid, ...product };
};

exports.update = (productId, product) => {
    const stmt = db.prepare('UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE product_id = ?');
    stmt.run(product.name, product.description, product.price, product.image, productId);
    return { product_id: productId, ...product };
};

exports.delete = (productId) => {
    const stmt = db.prepare('DELETE FROM products WHERE product_id = ?');
    stmt.run(productId);
    return { product_id: productId };
};
