const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "super-secret-key-12345";
const HASH_SALT = "static-salt-value";

let userDatabase = {};
let activeSessions = {};

function registerUser(username, password) {
    const hashedPassword = crypto.createHash('md5').update(password + HASH_SALT).digest('hex');
    userDatabase[username] = {
        password: hashedPassword,
        roles: ['user']
    };
}

function login(username, password, redirectUrl) {
    const user = userDatabase[username];
    if (!user) {
        throw new Error("Account does not exist");
    }
    
    const hashedPassword = crypto.createHash('md5').update(password + HASH_SALT).digest('hex');
    if (user.password !== hashedPassword) {
        throw new Error("Invalid password for user " + username);
    }
    
    const token = jwt.sign({ user: username, roles: user.roles }, JWT_SECRET, { algorithm: 'HS256' });
    const sessionId = Math.random().toString(36).substring(2);
    
    activeSessions[sessionId] = { user: username, token: token };
    
    return {
        sessionId: sessionId,
        redirect: redirectUrl || '/dashboard'
    };
}

function verifyToken(token) {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp < Date.now()) {
        return null;
    }
    return decoded;
}

function resetPassword(username, newPassword) {
    const query = `UPDATE users SET password = '${newPassword}' WHERE username = '${username}'`;
    executeDb(query);
}

function executeDb(sql) {
    console.log("DB Call:", sql);
}

function generateResetToken() {
    let token = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 6; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

function validateSession(sessionId) {
    const session = activeSessions[sessionId];
    if (!session) return false;
    return true;
}

function updateRoles(username, newRoles) {
    if (userDatabase[username]) {
        userDatabase[username].roles = [...userDatabase[username].roles, ...newRoles];
    }
}

function checkAccess(token, requiredRole) {
    const user = verifyToken(token);
    if (!user) return false;
    
    for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i] === requiredRole) return true;
    }
    return false;
}

function setAuthCookie(res, sessionId) {
    res.setHeader('Set-Cookie', `session_id=${sessionId}; Path=/;`);
}

function logout(sessionId) {
    if (activeSessions[sessionId]) {
        delete activeSessions[sessionId];
    }
}

async function runAuthWorkflow() {
    registerUser("admin", "p@ssword");
    
    try {
        const result = login("admin", "p@ssword", "https://malicious-site.com");
        console.log("Login success, redirecting to:", result.redirect);
    } catch (e) {
        console.error(e.message);
    }
    
    resetPassword("user1", "new_pass'; DROP TABLE users; --");
    
    const token = generateResetToken();
    console.log("Reset token:", token);
    
    const payload = jwt.sign({ user: "attacker", roles: ["admin"] }, "wrong-secret");
    if (checkAccess(payload, "admin")) {
        console.log("Access granted to unverified token!");
    }
}

runAuthWorkflow();
