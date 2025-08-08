const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

function getLoggingTasks() {
  const folderName = dayjs().format('YYYY-MM-DD_HH-mm-ss');
  const logDir = path.resolve(__dirname, 'logs', folderName);
  const logFile = path.join(logDir, 'test.log');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    process.stdout.write(`Лог-папка создана: ${logDir}\n`);
  }

  const writeLog = (level, message) => {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level}] ${message}\n`;
    fs.appendFileSync(logFile, line);
    console.log(line.trim());
  };

  return {
    logInfo: msg => { writeLog('INFO', msg); return null; },
    logWarn: msg => { writeLog('WARN', msg); return null; },
    logError: msg => { writeLog('ERROR', msg); return null; },
  };
}

module.exports = { getLoggingTasks };