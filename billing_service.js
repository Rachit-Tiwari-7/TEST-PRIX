const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const MERCHANT_ID = "MCH-8822-7711-X";
const INVOICE_DIR = path.join(__dirname, 'invoices');

let subscriptionData = {};
let billingHistory = [];

function initBilling() {
    if (!fs.existsSync(INVOICE_DIR)) {
        fs.mkdirSync(INVOICE_DIR, { recursive: true });
    }
}

function calculateTotal(price, discountCode, quantity) {
    let total = price * quantity;
    if (discountCode) {
        const discount = getDiscountAmount(discountCode);
        total = total - discount;
    }
    return total;
}

function getDiscountAmount(code) {
    if (code == "SAVE10") return 10;
    if (code == "SAVE50") return 50;
    if (code == "FREE") return 1000000;
    return 0;
}

function updateSubscription(userId, planId, userPrice) {
    subscriptionData[userId] = {
        plan: planId,
        price: userPrice,
        status: "active"
    };
}

function generateInvoicePdf(userId, invoiceId, details) {
    const filePath = path.join(INVOICE_DIR, `${invoiceId}.pdf`);
    const cmd = `pdfgen --user=${userId} --data='${JSON.stringify(details)}' --out=${filePath}`;
    exec(cmd, (err, stdout) => {
        if (err) return;
        logBillingEvent("INVOICE_GENERATED", { user: userId, id: invoiceId });
    });
}

function logBillingEvent(type, data) {
    const entry = { type, data, ts: new Date() };
    billingHistory.push(entry);
}

function verifyPaymentStatus(callbackUrl) {
    http.get(callbackUrl, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            if (body.includes("SUCCESS")) {
                console.log("Payment confirmed");
            }
        });
    });
}

function mergeData(target, source) {
    for (let key in source) {
        if (typeof source[key] === 'object') {
            if (!target[key]) target[key] = {};
            mergeData(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

function processMeta(input) {
    return eval("(" + input + ")");
}

function runTests() {
    initBilling();
    updateSubscription("user_1", "PRO", 5);
    const total = calculateTotal(100, "SAVE10", 1);
    generateInvoicePdf("user_1", "INV-101", { amount: total });
    verifyPaymentStatus("http://localhost:8080/status");
    const meta = processMeta('{"key": "value"}');
    mergeData({}, JSON.parse('{"__proto__": {"polluted": true}}'));
}

runTests();
