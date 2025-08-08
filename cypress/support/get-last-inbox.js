const mailslurp = require('./mail-client');

let cachedInbox = null;

async function getLastInboxByCreatedDate() {
  // Используем кеш, если есть
  if (cachedInbox) {
    console.log('[INFO] Используем inbox из кеша:', cachedInbox.emailAddress);
    return cachedInbox;
  }

  try {
    // Пробуем создать новый inbox
    const created = await mailslurp.createInbox();
    console.log('[INFO] Создан новый inbox:', created.emailAddress);
    cachedInbox = created;
    return created;
  } catch (err) {
    console.warn('[WARN] Не удалось создать inbox:', err.message);
  }

  // Если создание не удалось — пробуем найти последний
  try {
    const allInboxes = await mailslurp.getAllInboxes();
    const inboxes = allInboxes.content || [];

    if (!inboxes.length) {
      console.warn('[WARN] Нет доступных inbox-ов');
      return null;
    }

    const sorted = inboxes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const lastInbox = sorted[0];

    console.log('[INFO] Используем последний существующий inbox:', lastInbox.emailAddress);
    cachedInbox = lastInbox;
    return lastInbox;
  } catch (e) {
    console.error('[ERROR] Не удалось получить список inbox-ов:', e.message);
    return null;
  }
}

module.exports = getLastInboxByCreatedDate;