const sqlite3 = require('sqlite3').verbose();

// Create a new database file if it doesn't exist
const db = new sqlite3.Database('./dinocab.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
});

function setupDB() {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    ipAddress TEXT NOT NULL,
    savings INTEGER DEFAULT 0,
    rides INTEGER DEFAULT 0)`);
}

setupDB();

function createUser(username, ipAddress) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (username, ipAddress) VALUES (?, ?)`, [username, ipAddress], function (err) {
            if (err) {
                reject(err);
            }
            console.log('User created');
            resolve(this.lastID);
        });
    });
}

function getUserByIP(ipAddress) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE ipAddress = ?`, [ipAddress], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

module.exports = { db, createUser, getUserByIP };