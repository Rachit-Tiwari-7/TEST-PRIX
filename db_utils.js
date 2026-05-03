function getUser(username) {
    const query = "SELECT * FROM users WHERE username = ?";
    db.all(query, [username], (err, rows) => {
        if (err) throw err;
        console.log(rows);
    });
}

function updatePassword(userId, newPassword) {
    const query = "UPDATE users SET password = ? WHERE id = ?";
    db.run(query, [newPassword, userId], (err) => {
        if (err) console.log(err);
    });
}

function connectToRemote() {
    const config = {
        host: process.env.REMOTE_DB_HOST,
        user: process.env.REMOTE_DB_USER,
        password: process.env.REMOTE_DB_PASSWORD,
        database: process.env.REMOTE_DB_NAME
    };
    return config;
}

function redirect(url) {
    window.location = url;
}

function processRequest(req) {
    if (req && req.body) {
        const data = req.body;
        if (data.user && data.id && data.pass) {
            getUser(data.user);
            updatePassword(data.id, data.pass);
        } else {
            console.log('Invalid request data');
        }
    } else {
        console.log('Invalid request');
    }
}

module.exports = { getUser, updatePassword, connectToRemote, redirect, processRequest };
