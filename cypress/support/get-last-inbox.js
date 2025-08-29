const mailslurp = require('./mail-client');

let cachedInbox = null;

async function getLastInboxByCreatedDate() {
  // Используем кеш, если есть
  if (cachedInbox) {
    console.log('[INFO] Используем inbox из кеша:', cachedInbox.emailAddress);
    return cachedInbox;
  }

  // Сначала пробуем найти последний существующий inbox
  try {
    const allInboxes = await mailslurp.getAllInboxes();
    const inboxes = allInboxes.content || [];

    if (inboxes.length > 0) {
      const sorted = inboxes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      cachedInbox = sorted[0];
      console.log('[INFO] Используем последний существующий inbox:', cachedInbox.emailAddress);
      return cachedInbox;
    } else {
      console.warn('[WARN] Нет доступных inbox-ов, будем создавать новый');
    }
  } catch (e) {
    console.error('[ERROR] Не удалось получить список inbox-ов:', e.message);
  }

  // Если не нашли — создаём новый inbox
  try {
    cachedInbox = await mailslurp.createInbox();
    console.log('[INFO] Создан новый inbox:', cachedInbox.emailAddress);
    return cachedInbox;
  } catch (err) {
    console.warn('[WARN] Не удалось создать inbox:', err.message);
    return null;
  }
}

module.exports = getLastInboxByCreatedDate;
