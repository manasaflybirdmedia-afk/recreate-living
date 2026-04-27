const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'recreate.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT
        )`, (err) => {
            if (err) {
                console.error("Error creating users table", err);
            } else {
                // Insert default admin if not exists
                db.get("SELECT * FROM users WHERE email = 'admin@recreateliving.com'", (err, row) => {
                    if (!row) {
                        db.run("INSERT INTO users (email, password, role) VALUES ('admin@recreateliving.com', 'Admin@123', 'admin')");
                        console.log("Default admin created.");
                    }
                });
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            stock INTEGER DEFAULT 0,
            image TEXT
        )`, (err) => {
            if (err) {
                console.error("Error creating products table", err);
            } else {
                // Insert some default products to show on the frontend
                db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
                    if (row && row.count === 0) {
                        const defaultProducts = [
                            { name: 'Royal Velvet Sofa', description: 'Premium 3-seater handcrafted with velvet upholstery.', price: 1200, stock: 5, image: '/assets/4b31cf9c-e09b-4a22-84e5-ac6b7d6a6cf9.jpg' },
                            { name: 'Classic Leather Couch', description: 'Timeless design with genuine leather finishing.', price: 1500, stock: 2, image: '/assets/c425dc5d-ebe1-4bab-a9e4-18f316a4347e.png' },
                            { name: 'Modern Minimalist Set', description: 'Sleek design perfect for contemporary spaces.', price: 950, stock: 10, image: '/assets/c90c2aaf-126e-4ab2-a1d2-46c4d2a146cd.jpg' }
                        ];
                        const insert = db.prepare("INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)");
                        defaultProducts.forEach(p => {
                            insert.run(p.name, p.description, p.price, p.stock, p.image);
                        });
                        insert.finalize();
                        console.log("Default products created.");
                    }
                });
            }
        });
    }
});

module.exports = db;
