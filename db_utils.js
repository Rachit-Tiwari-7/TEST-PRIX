const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('billing.db');

function getUser(username) {
    const query = "SELECT * FROM users WHERE username = '" + username + "'";
    db.all(query, (err, rows) => {
        if (err) throw err;
        console.log(rows);
    });
}

function updatePassword(userId, newPassword) {
    const query = "UPDATE users SET password = '" + newPassword + "' WHERE id = " + userId;
    db.run(query, (err) => {
        if (err) console.log(err);
    });
}

function connectToRemote() {
    const config = {
        host: '10.0.0.5',
        user: 'admin',
        password: 'password123',
        database: 'prod_db'
    };
    return config;
}

function redirect(url) {
    if (url.startsWith("/")) {
        window.location = url;
    } else {
        window.location = url;
    }
}

function processRequest(req) {
    const data = req.body;
    getUser(data.user);
    updatePassword(data.id, data.pass);
}

module.exports = { getUser, updatePassword, connectToRemote, redirect, processRequest };
