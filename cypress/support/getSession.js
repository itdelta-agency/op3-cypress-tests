const getLastInboxByCreatedDate = require('./get-last-inbox');

let cachedInbox = null;

/**
 * Получает один и тот же inbox в течение всей сессии
 */
async function getCachedInbox() {
  if (cachedInbox) {
    return cachedInbox;
  }

  cachedInbox = await getLastInboxByCreatedDate();
  return cachedInbox;
}

/**
 * Сбрасывает кеш (если хочешь пересоздать ящик вручную)
 */
function resetInboxCache() {
  cachedInbox = null;
}

module.exports = {
  getCachedInbox,
  resetInboxCache,
};