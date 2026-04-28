const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

const PASSWORD_PREFIX = 'scrypt';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'manager@recreateliving.com';
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'Recreate#2026';

function hashPassword(plainPassword) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(plainPassword, salt, 64).toString('hex');
    return `${PASSWORD_PREFIX}:${salt}:${derivedKey}`;
}

function isLegacyPassword(storedPassword) {
    return typeof storedPassword === 'string' && !storedPassword.startsWith(`${PASSWORD_PREFIX}:`);
}

function verifyPassword(plainPassword, storedPassword) {
    if (typeof storedPassword !== 'string' || storedPassword.length === 0) {
        return false;
    }

    if (isLegacyPassword(storedPassword)) {
        return plainPassword === storedPassword;
    }

    const parts = storedPassword.split(':');
    if (parts.length !== 3 || parts[0] !== PASSWORD_PREFIX) {
        return false;
    }

    const [, salt, savedHash] = parts;
    const computedHash = crypto.scryptSync(plainPassword, salt, 64).toString('hex');
    const savedBuffer = Buffer.from(savedHash, 'hex');
    const computedBuffer = Buffer.from(computedHash, 'hex');

    if (savedBuffer.length !== computedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(savedBuffer, computedBuffer);
}

const dbPath = path.resolve(__dirname, 'recreate.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }

    console.log('Connected to the SQLite database.');

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member'
    )`, (usersErr) => {
        if (usersErr) {
            console.error('Error creating users table', usersErr.message);
            return;
        }

        db.get('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL], (findErr, row) => {
            if (findErr) {
                console.error('Error checking default admin', findErr.message);
                return;
            }

            if (!row) {
                db.run(
                    'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
                    [ADMIN_EMAIL, hashPassword(ADMIN_DEFAULT_PASSWORD), 'admin'],
                    (seedErr) => {
                        if (seedErr) {
                            console.error('Error creating default admin', seedErr.message);
                            return;
                        }
                        console.log(`Default admin created (${ADMIN_EMAIL}).`);
                    }
                );
            }
        });
    });

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        image TEXT DEFAULT ''
    )`, (productsErr) => {
        if (productsErr) {
            console.error('Error creating products table', productsErr.message);
            return;
        }

        db.get('SELECT COUNT(*) as count FROM products', (countErr, row) => {
            if (countErr) {
                console.error('Error checking default products', countErr.message);
                return;
            }

            if (row && row.count === 0) {
                const defaultProducts = [
                    {
                        name: 'Royal Velvet Sofa',
                        description: 'Premium 3-seater handcrafted with velvet upholstery.',
                        price: 1200,
                        stock: 5,
                        image: '/assets/4b31cf9c-e09b-4a22-84e5-ac6b7d6a6cf9.jpg'
                    },
                    {
                        name: 'Classic Leather Couch',
                        description: 'Timeless design with genuine leather finishing.',
                        price: 1500,
                        stock: 2,
                        image: '/assets/c425dc5d-ebe1-4bab-a9e4-18f316a4347e.png'
                    },
                    {
                        name: 'Modern Minimalist Set',
                        description: 'Sleek design perfect for contemporary spaces.',
                        price: 950,
                        stock: 10,
                        image: '/assets/c90c2aaf-126e-4ab2-a1d2-46c4d2a146cd.jpg'
                    }
                ];

                const insert = db.prepare(
                    'INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)'
                );

                defaultProducts.forEach((product) => {
                    insert.run(product.name, product.description, product.price, product.stock, product.image);
                });

                insert.finalize((finalizeErr) => {
                    if (finalizeErr) {
                        console.error('Error finalizing default products seed', finalizeErr.message);
                        return;
                    }
                    console.log('Default products created.');
                });
            }
        });
    });
});

module.exports = {
    db,
    hashPassword,
    verifyPassword,
    isLegacyPassword
};
