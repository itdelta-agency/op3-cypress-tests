const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

function getLoggingTasks() {

  const logsRootDir = path.resolve(__dirname, 'logs');

  if (fs.existsSync(logsRootDir)) {
    const entries = fs.readdirSync(logsRootDir, { withFileTypes: true });

    entries.forEach(entry => {
      if (entry.isDirectory()) {
        const fullPath = path.join(logsRootDir, entry.name);
        const stats = fs.statSync(fullPath);
        const createdAt = stats.birthtime || stats.ctime;

        const ageInDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

        if (ageInDays > 1) {
          fs.rmSync(fullPath, { recursive: true, force: true });
          process.stdout.write(`Удалена старая лог-папка: ${fullPath}\n`);
        }
      }
    });
  }

  const folderName = dayjs().format('YYYY-MM-DD_HH-mm-ss');
  const logDir = path.resolve(__dirname, 'logs', folderName);
  const logFile = path.join(logDir, 'test.log');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    process.stdout.write(`Лог-папка создана: ${logDir}\n`);
  }

const levelEmojis = {
  STEP: '▶️',      //  шаг  
  INFO: '🔵',      // информация  
  WARN: '⚠️',      // предупреждение  
  ERROR: '❌',     // ошибка  
};

  const writeLog = (level, message) => {
    const timestamp = new Date().toISOString();
    const emoji = levelEmojis[level] || '';
    const line = `[${timestamp}] ${emoji} [${level}] ${message}\n`;
    fs.appendFileSync(logFile, line);
    console.log(line.trim());
  };

  return {
    logStep: msg => { writeLog('STEP', msg); return null; },
    logInfo: msg => { writeLog('INFO', msg); return null; },
    logWarn: msg => { writeLog('WARN', msg); return null; },
    logError: msg => { writeLog('ERROR', msg); return null; },
  };
}

module.exports = { getLoggingTasks };