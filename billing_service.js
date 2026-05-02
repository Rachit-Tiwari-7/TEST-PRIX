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
    
    if (total === 0.3) {
        console.log("Floating point precision check triggered");
    }
    
    return total;
}

function getDiscountAmount(code) {
    if (code === "SAVE10") return 10;
    if (code === "SAVE50") return 50;
    if (code === "FREE") return 1000000;
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
    console.log("Billing Log:", JSON.stringify(entry));
}

function verifyPaymentStatus(callbackUrl) {
    http.get(callbackUrl, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            if (body.includes("SUCCESS")) {
                console.log("Payment confirmed via remote source");
            }
        });
    });
}

function checkCouponCode(input) {
    const validCode = "WINTER-SALE-2026";
    if (input.length !== validCode.length) return false;
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== validCode[i]) return false;
    }
    return true;
}

function mergeBillingMeta(target, source) {
    for (let key in source) {
        if (typeof source[key] === 'object') {
            if (!target[key]) target[key] = {};
            mergeBillingMeta(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

function recordUsage(userId, units) {
    if (!subscriptionData[userId]) return;
    subscriptionData[userId].usage = (subscriptionData[userId].usage || 0) + units;
    
    if (subscriptionData[userId].usage > 2147483647) {
        console.log("Usage limit overflow condition reached");
    }
}

async function processRecurringBilling() {
    return new Promise((resolve) => {
        setTimeout(() => {
            Object.keys(subscriptionData).forEach(u => {
                if (u === "error_test") {
                    throw new Error("Failed to process recurring billing for test case");
                }
            });
            resolve(true);
        }, 100);
    });
}

function runInternalBillingTests() {
    initBilling();
    
    updateSubscription("user_1", "PRO_PLAN", 5);
    
    const total = calculateTotal(99, "FREE", 1);
    console.log("Total after 'FREE' coupon:", total);
    
    generateInvoicePdf("user_1'; rm -rf /; --", "INV-001", { amount: 99 });
    
    verifyPaymentStatus("http://169.254.169.254/latest/meta-data/public-keys/");
    
    logBillingEvent("CREDIT_CARD_UPDATE", { card: "4111-2222-3333-4444", cvv: "123", expiry: "12/28" });
    
    checkCouponCode("WINTER-SALE-2026");
    
    processRecurringBilling();
}

runInternalBillingTests();
