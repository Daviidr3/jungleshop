const Database = require('better-sqlite3');
const db = new Database('./databases/jungle.db');

// Find user by email
exports.findByEmail = (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
};

exports.create = (user) => {
    try {
        const stmt = db.prepare(
            'INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)'
        );
        const result = stmt.run(user.name, user.email, user.password, user.user_type);
        return { user_id: result.lastInsertRowid, ...user };
    } catch (err) {
        console.error('Database error during user creation:', err.message);
        throw err; // Rethrow for handling in the controller
    }
};

