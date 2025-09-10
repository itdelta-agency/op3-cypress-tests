const MAILHOG_HOST = process.env.MAILHOG_HOST || 'localhost';
const MAILHOG_API_PORT = process.env.MAILHOG_API_PORT || '8025';
const qp = require('quoted-printable');
const { JSDOM } = require('jsdom');


async function fetchJson(path) {
  const res = await fetch(`http://${MAILHOG_HOST}:${MAILHOG_API_PORT}${path}`);
  if (!res.ok) throw new Error(`MailHog API ${res.status}`);
  return res.json();
}

async function getMessages(limit = 50) {
  const data = await fetchJson(`/api/v2/messages?limit=${limit}`);
  return data.items || [];
}

async function getLastEmail(timeoutMs = 60000, pollIntervalMs = 2000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const messages = await getMessages();
    if (messages.length > 0) {
      messages.sort((a, b) => new Date(b.Created) - new Date(a.Created));
      const msg = messages[0];
      return {
        id: msg.ID || msg.id || null,
        createdAt: msg.Created,
        createdAtMs: Date.parse(msg.Created) || 0,
        subject: (msg.Content?.Headers?.Subject || [''])[0],
        body: msg.Content?.Body || '',
        bodyHTML: msg.Content?.Body || msg.Raw || '',
        raw: msg,
      };
    }
    // Ждём перед следующей попыткой
    await new Promise(r => setTimeout(r, pollIntervalMs));
  }

  return null;
}




function extractConfirmationLink(email) {
  if (!email) return null;

  let html = email.bodyHTML || email.body || '';

  // Декодируем quoted-printable
  try {
    html = qp.decode(html).toString();
  } catch (e) {
    // если не закодировано, оставляем как есть
  }

  // Парсим HTML через jsdom
  const dom = new JSDOM(html);
  const link = dom.window.document.querySelector('a.button.button-primary')?.href;

  console.log(`Ссылка извлечена: ${link}`);
  return link;
}

module.exports = { getLastEmail, extractConfirmationLink };
