
const mailslurp = require('./mail-client');
async function getLastInboxByCreatedDate() {
  try {
    const created = await mailslurp.createInbox();
    console.log('createInbox ответ:', created);
    if (!created || !created.id) {
      console.error('createInbox не вернул корректный inbox');
      throw new Error('createInbox не вернул корректный inbox');
    }
    console.log('Создан новый inbox:', created.emailAddress);
    return created;
  } catch (err) {
    console.warn('Не удалось создать inbox:', err.message);

    const allInboxes = await mailslurp.getAllInboxes();
    console.log('Список inbox-ов:', allInboxes);
    const inboxes = allInboxes.content || [];

    if (!inboxes.length) {
      console.error('Нет доступных inbox-ов в аккаунте MailSlurp.');
      throw new Error('Нет доступных inbox-ов в аккаунте MailSlurp.');
    }

    const sorted = inboxes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const lastInbox = sorted[0];

    if (!lastInbox || !lastInbox.emailAddress) {
      console.error('Полученный последний inbox невалиден');
      throw new Error('Полученный последний inbox невалиден');
    }

    console.log('Используется последний inbox:', lastInbox.emailAddress);
    return lastInbox;
  }
}
module.exports = getLastInboxByCreatedDate;