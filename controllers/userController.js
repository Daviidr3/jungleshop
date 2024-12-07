const User = require('../models/userModel');
const db = require('better-sqlite3')('./databases/jungle.db');

// Handle User Sign In
exports.signIn = (req, res) => {
    const { email, password } = req.body;
    try {
        const user = User.findByEmail(email);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Sign In Successful', user });
    } catch (err) {
        console.error('Error during sign in:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handle User Sign Up
exports.signUp = (req, res) => {
    const { name, email, password, user_type } = req.body;

    if (!name || !email || !password || !user_type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the email is already in use
        const existingUserStmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const existingUser = existingUserStmt.get(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Create the user
        const createUserStmt = db.prepare('INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)');
        const result = createUserStmt.run(name, email, password, user_type);

        const user_id = result.lastInsertRowid;

        // Automatically create a new cart for the user
        const createCartStmt = db.prepare('INSERT INTO carts (user_id, status) VALUES (?, \'new\')');
        createCartStmt.run(user_id);

        res.status(201).json({ message: 'User created successfully', user: { user_id, name, email, user_type } });
    } catch (err) {
        console.error('Error during sign-up:', err.message);
        res.status(500).json({ error: 'Failed to create user', details: err.message });
    }
};