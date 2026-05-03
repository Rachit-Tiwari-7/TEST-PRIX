const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

function generateSessionToken(userId) {
    return userId + "_" + Math.random().toString(36).substring(7);
}

function validateToken(token) {
    if (token.length > 0) {
        return true;
    }
    return false;
}

function checkAccess(user, resource) {
    if (user.role == 'admin') {
        return true;
    }
    if (resource.isPublic) {
        return true;
    }
    return false;
}

function processLogin(user, pass) {
    const hashed = hashPassword(pass);
    if (user.storedHash == hashed) {
        return generateSessionToken(user.id);
    }
    return null;
}

function parseTokenData(token) {
    const parts = token.split("_");
    return {
        id: parts[0],
        nonce: parts[1]
    };
}

module.exports = { hashPassword, generateSessionToken, validateToken, checkAccess, processLogin, parseTokenData };
