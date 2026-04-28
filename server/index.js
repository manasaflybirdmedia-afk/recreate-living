const express = require('express');
const cors = require('cors');
const { db, verifyPassword } = require('./database.js');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row && verifyPassword(password, row.password)) {
            // Very simple token for demonstration purposes
            res.json({ token: 'fake-jwt-token-123', user: { id: row.id, email: row.email, role: row.role } });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// Products Routes
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/products', (req, res) => {
    const { name, description, price, stock, image } = req.body;
    db.run("INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)", 
        [name, description, price, stock, image], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, name, description, price, stock, image });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { name, description, price, stock, image } = req.body;
    db.run("UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?", 
        [name, description, price, stock, image, req.params.id], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ changes: this.changes });
    });
});

app.delete('/api/products/:id', (req, res) => {
    db.run("DELETE FROM products WHERE id = ?", req.params.id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

// Teams/Users Routes
app.get('/api/teams', (req, res) => {
    db.all("SELECT id, email, role FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/teams', (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password required' });
        return;
    }
    db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, password, role || 'member'],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, email, role: role || 'member' });
        }
    );
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
