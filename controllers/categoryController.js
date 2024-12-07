const db = require('better-sqlite3')('./databases/jungle.db');

exports.getAllCategories = (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM categories');
        const categories = stmt.all();
        res.status(200).json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err.message);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
