const Database = require('better-sqlite3');
const db = new Database('./databases/jungle.db', { verbose: console.log });

exports.getAll = () => {
    const stmt = db.prepare('SELECT * FROM orders');
    return stmt.all(); // Returns all rows
};

exports.create = (order) => {
    const stmt = db.prepare('INSERT INTO orders (userId, productIds, total) VALUES (?, ?, ?)');
    const info = stmt.run(order.userId, JSON.stringify(order.productIds), order.total);
    return { id: info.lastInsertRowid, ...order };
};

exports.update = (id, order) => {
    const stmt = db.prepare('UPDATE orders SET userId = ?, productIds = ?, total = ? WHERE id = ?');
    stmt.run(order.userId, JSON.stringify(order.productIds), order.total, id);
    return { id, ...order };
};

exports.delete = (id) => {
    const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
    stmt.run(id);
    return { id };
};
