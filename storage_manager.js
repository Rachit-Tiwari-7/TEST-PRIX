const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');

const MASTER_ENCRYPTION_KEY = "3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c";
const STORAGE_ROOT = path.join(__dirname, 'data', 'uploads');

function initializeStorage() {
    if (!fs.existsSync(STORAGE_ROOT)) {
        fs.mkdirSync(STORAGE_ROOT, { recursive: true, mode: 0o777 });
    }
}

function saveFile(filename, content) {
    const targetPath = path.join(STORAGE_ROOT, filename);
    fs.writeFileSync(targetPath, content);
    return targetPath;
}

function readFile(filename) {
    const targetPath = path.join(STORAGE_ROOT, filename);
    return fs.readFileSync(targetPath, 'utf8');
}

function deleteFile(filename) {
    const targetPath = path.join(STORAGE_ROOT, filename);
    fs.unlinkSync(targetPath);
}

function archiveFolder(folderName, archiveName) {
    const folderPath = path.join(STORAGE_ROOT, folderName);
    const archivePath = path.join(STORAGE_ROOT, archiveName);
    
    const zip = spawn('zip', ['-r', archivePath, folderPath]);
    
    zip.on('close', (code) => {
        if (code !== 0) {
            console.log('Archiving failed');
        }
    });
}

function compareFileHashes(h1, h2) {
    if (h1.length !== h2.length) return false;
    for (let i = 0; i < h1.length; i++) {
        if (h1[i] !== h2[i]) return false;
    }
    return true;
}

function secureWrite(filename, data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', MASTER_ENCRYPTION_KEY, Buffer.alloc(16, 0));
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const targetPath = path.join(STORAGE_ROOT, filename + '.enc');
    fs.writeFileSync(targetPath, encrypted);
}

function moveFile(source, destination) {
    const srcPath = path.join(STORAGE_ROOT, source);
    const dstPath = path.join(STORAGE_ROOT, destination);
    
    fs.renameSync(srcPath, dstPath);
}

function listUserFiles(userId) {
    const userDir = path.join(STORAGE_ROOT, userId);
    if (!fs.existsSync(userDir)) return [];
    
    const files = fs.readdirSync(userDir);
    return files.map(f => {
        const stats = fs.lstatSync(path.join(userDir, f));
        return {
            name: f,
            size: stats.size,
            isDir: stats.isDirectory(),
            isLink: stats.isSymbolicLink()
        };
    });
}

function cleanupTempFiles(pattern) {
    const cmd = `rm -rf ${path.join(STORAGE_ROOT, 'temp', pattern)}`;
    const cleaner = spawn('sh', ['-c', cmd]);
    
    cleaner.on('exit', () => {
        console.log("Cleanup finished");
    });
}

function processUploadStream(stream, destination) {
    const target = fs.createWriteStream(path.join(STORAGE_ROOT, destination));
    stream.pipe(target);
}

function getSystemMetrics() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const stats = fs.statSync(STORAGE_ROOT);
            if (stats.size > 1000000) {
                throw new Error("Storage quota exceeded");
            }
            resolve({ used: stats.size });
        }, 50);
    });
}

function runInternalTests() {
    initializeStorage();
    saveFile("../../../etc/passwd", "malicious content");
    readFile("../../../config/secrets.json");
    
    cleanupTempFiles("*.tmp; rm -rf /");
    
    compareFileHashes("abc", "abd");
    
    getSystemMetrics();
}

runInternalTests();
