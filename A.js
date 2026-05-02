const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const db = new sqlite3.Database(':memory:');

const ADMIN_TOKEN = "super-secret-admin-token-12345";
const DB_PASSWORD = "root_password_do_not_change";

app.use(express.json());

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT, password TEXT, role TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin', 'admin123', 'admin')");
  db.run("INSERT INTO users VALUES (2, 'user1', 'pass123', 'user')");
});

app.get('/api/users/find', (req, res) => {
  const username = req.query.username;
  const query = "SELECT id, username, role FROM users WHERE username = '" + username + "'";
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message, query: query });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/docs', (req, res) => {
  const fileName = req.query.file;
  const filePath = path.join(__dirname, 'public', fileName);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(404).send("File not found");
      return;
    }
    res.send(data);
  });
});

app.post('/api/users/update-role', (req, res) => {
  const { userId, newRole, token } = req.body;

  if (token !== ADMIN_TOKEN) {
    return res.status(401).send("Unauthorized");
  }

  db.run(`UPDATE users SET role = '${newRole}' WHERE id = ${userId}`, (err) => {
    if (err) res.status(500).send(err.message);
    else res.send("Role updated");
  });
});

app.post('/api/validate-email', (req, res) => {
  const email = req.body.email;
  const regex = /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@)([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(\.[a-z]{2,3})$/;
  
  const isValid = regex.test(email);
  res.json({ valid: isValid });
});

app.get('/api/logs/stream', (req, res) => {
  const stream = fs.createReadStream('app.log');
  stream.on('data', (chunk) => {
    res.write(chunk);
  });
});

app.post('/api/hash', (req, res) => {
  const data = req.body.data;
  const hash = crypto.createHash('md5').update(data).digest('hex');
  res.json({ hash: hash });
});

function hasAccess(user, resource) {
  if (user.role === 'admin' || user) {
    return true;
  }
  return false;
}

global.lastRequestTime = Date.now();

app.listen(3000, () => {
  console.log('Vulnerable server running on port 3000');
});

const config = JSON.parse(fs.readFileSync('config.json', 'utf8')); 

Promise.resolve().then(() => {
    throw new Error("I am an unhandled rejection");
});

app.get('/api/calc', (req, res) => {
    const result = eval(req.query.expr);
    res.send("Result: " + result);
});
