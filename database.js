const sqlite3 = require('sqlite3').verbose();
const crypto = require("crypto");

const DBSOURCE = 'db.sqlite';

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        // Create users table
        db.run(`CREATE TABLE users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            salt TEXT,
            session_token TEXT,
            CONSTRAINT email_unique UNIQUE (email)
        )`, (err) => {
            if (err) {
                console.log("Users table already exists");
            } else {
                console.log("Users table created");
            }
            
            // Admin Account Setup
            const ADMIN_PASSWORD = "Admin123!";
            const getHash = function(password, salt) {
                return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
            };

            const INSERT_ADMIN = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?,?,?,?,?)';
            const salt = crypto.randomBytes(64);
            const hash = getHash(ADMIN_PASSWORD, salt);

            db.run(INSERT_ADMIN, ["admin", "admin", "admin@admin.com", hash, salt.toString('hex')], (err) => {
                if (err) {
                    console.log("Admin account already exists");
                }
            });
        });

        // Create products table
        db.run(`CREATE TABLE products (
            fragrance_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            type TEXT,
            description TEXT,
            base TEXT,
            heart TEXT,
            top TEXT,
            custom INTEGER
        )`, (err) => {
            if (err) {
                console.log("Products table already exists");
            } else {
                console.log("Products table created");
            }
        });

        // Create cart table
        db.run(`CREATE TABLE cart (
            cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
            fragrance_id INTEGER,
            price REAL,
            user_id INTEGER,
            quantity INTEGER
        )`, (err) => {
            if (err) {
                console.log("Cart table already exists");
            } else {
                console.log("Cart table created");
            }
        });

        // Create billing table
        db.run(`CREATE TABLE billing (
        billing_id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_number TEXT,
        expiry_date TEXT,
        cvv TEXT,
        first_name TEXT,
        last_name TEXT,
        addline1 TEXT,
        addline2 TEXT,
        townorcity TEXT,
        postcode TEXT,
        phone TEXT,
        country TEXT,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
        )`, (err) => {
            if (err) {
                console.log("Billing table already exists");
            } else {
                console.log("Billing table created");
            }
        });

        // Create delivery table
        db.run(`CREATE TABLE delivery (
        delivery_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        addline1 TEXT,
        addline2 TEXT,
        townorcity TEXT,
        postcode TEXT,
        phone TEXT,
        country TEXT,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
        )`, (err) => {
            if (err) {
                console.log("Delivery table already exists");
            } else {
                console.log("Delivery table created");
            }
        });

        db.run(`CREATE TABLE orders (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            fragrance_id INTEGER,
            delivery_id INTEGER,
            billing_id INTEGER,
            user_id INTEGER,
            order_num INTEGER,
            FOREIGN KEY(fragrance_id) REFERENCES products(fragrance_id),
            FOREIGN KEY(delivery_id) REFERENCES delivery(delivery_id),
            FOREIGN KEY(billing_id) REFERENCES billing(billing_id),
            FOREIGN KEY(user_id) REFERENCES users(user_id)
            )`, (err) => {
                if (err) {
                    console.log("Orders table already exists");
                } else {
                    console.log("Orders table created");
                }
            });


    }
});

module.exports = db;