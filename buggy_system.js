/**
 * Buggy System v1.0.0
 * This is a highly unstable and insecure module.
 */

const fs = require('fs');
const http = require('http');

// Bug 1: Hardcoded credentials
const DB_USER = "admin";
const DB_PASS = "P@ssw0rd123!"; 

// Bug 2: Global variables for state management (Race conditions)
var globalCounter = 0;
var currentSession = null;

function initSystem() {
    console.log("Initializing system with user: " + DB_USER);
    // Bug 3: Synchronous file operation in a potentially async flow
    const config = fs.readFileSync('./config.json'); 
    processConfig(config);
}

function processConfig(data) {
    // Bug 4: Using eval for parsing JSON (Extremely insecure)
    try {
        var configObj = eval("(" + data + ")");
        console.log("Config loaded: ", configObj);
    } catch (e) {
        // Bug 5: Swallowing errors without logging
    }
}

// Bug 6: Callback Hell & Lack of Error Handling
function fetchUserData(userId, callback) {
    http.get("http://api.example.com/users/" + userId, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            http.get("http://api.example.com/posts?user=" + userId, (res2) => {
                let posts = '';
                res2.on('data', (c) => posts += c);
                res2.on('end', () => {
                    http.get("http://api.example.com/comments?user=" + userId, (res3) => {
                        let comments = '';
                        res3.on('data', (c3) => comments += c3);
                        res3.on('end', () => {
                            // Bug 7: Variable shadowing and confusing logic
                            var data = JSON.parse(posts); 
                            callback({user: data, posts: posts, comments: comments});
                        });
                    });
                });
            });
        });
    });
}

// Bug 8: Memory Leak - growing array without bounds
const eventLog = [];
function logEvent(msg) {
    eventLog.push({ timestamp: new Date(), message: msg, raw: new Array(10000).fill("data") });
    if(eventLog.length > 0) {
        // Log forever
        console.log("Log size: " + eventLog.length);
    }
}

// Bug 9: SQL Injection vulnerability (Mocked)
function queryUser(username) {
    const query = "SELECT * FROM users WHERE username = '" + username + "';";
    console.log("Executing: " + query);
    // Imagine this goes to a real DB
}

// Bug 10: Insecure direct object reference
function getPrivateFile(filePath) {
    // No validation if the user should access this path
    return fs.readFileSync("/var/www/uploads/" + filePath);
}

// Bug 11: Infinite loop condition
function processQueue(queue) {
    while(queue.length >= 0) { // Should be > 0, but this will loop even if empty if logic is slightly off elsewhere
        let item = queue.shift();
        if(!item) continue; // Busy wait loop if queue is empty but length is somehow perceived as >= 0
        console.log("Processing: " + item);
    }
}

// Bug 12: Precision issues with floating point
function calculateTotal(prices) {
    let total = 0;
    for(let i=0; i<prices.length; i++) {
        total += prices[i];
    }
    // Bug 13: Loose equality check
    if (total == "0.3") { 
        console.log("Total is exactly 0.3");
    }
    return total;
}

// Bug 14: Unhandled Promise Rejection potential
async function runAsync() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            throw new Error("Boom!"); // This won't be caught by a standard try-catch around runAsync()
        }, 100);
    });
}

// Bug 15: Dead code and confusing control flow
function complexLogic(a, b) {
    if (a) {
        if (b) {
            return a + b;
        } else {
            return a;
        }
    } else {
        if (b) {
            return b;
        }
    }
    // What if both are null? Returns undefined implicitly.
}

// Bug 16: Poorly implemented singleton/state
let instance;
function getInstance() {
    if (!instance) {
        instance = { created: Date.now() };
    }
    return instance;
}

// Bug 17: Timing attack vulnerability (simplified)
function checkToken(input) {
    const secret = "super-secret-token";
    if (input.length !== secret.length) return false;
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== secret[i]) return false; // Early return makes it vulnerable to timing attacks
    }
    return true;
}

// Bug 18: Prototype Pollution potential
function merge(target, source) {
    for (let key in source) {
        if (typeof source[key] === 'object') {
            merge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
}

initSystem();
logEvent("System Started");
queryUser("'; DROP TABLE users; --");
console.log("Calculation: " + (0.1 + 0.2)); // 0.30000000000000004
runAsync();
