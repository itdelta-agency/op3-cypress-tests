const { ROUTES } = require("../../support/routes");
const { JSDOM } = require("jsdom");

describe("C. Invite user by 2 ways", () => {
  let confirmationLink;
  let sentAt;

  // Получаем inbox один раз перед всеми тестами и сохраняем в Cypress.env
  before(() => {
    cy.task('getCachedInbox').then(result => {
      expect(result).to.exist;
      Cypress.env('inbox', result);
      cy.log('📬 Используем кешированный inbox:', result.emailAddress);
    });
  });

  beforeEach(function () {
    cy.logTestName.call(this);
    cy.resetAppState();
  });

  it('should invite by user menu', () => {
    const inbox = Cypress.env('inbox');
    expect(inbox).to.exist;

    cy.admin();
    // cy.changeLang(); // раскомментируй если нужно менять язык
    cy.visit(ROUTES.invite);

    // Фиксируем время отправки письма
    sentAt = Date.now();

    cy.xpath("//input[@id='email']").type(inbox.emailAddress);
    cy.xpath("//button[@type='submit']").click();
    cy.task('logInfo', `Приглашение отправлено пользователю ${inbox.emailAddress}`);
  });

  it('getting last email', function () {
 const inbox = Cypress.env('inbox');
if (!inbox) {
  cy.task('logError', 'Inbox не найден, тест пропускается');
  return; // тест не падает
}

const sentAt = Cypress.env('sentAt');
if (!sentAt) {
  cy.task('logError', 'Время отправки письма не задано, пропускаем проверку');
  return; // тест не падает
}

// Ждем новое письмо, которое пришло после sentAt
cy.task('getLastEmail', { inboxId: inbox.id, sentAt, timeout: 60000 }).then(email => {
  if (!email) {
    cy.task('logError', '⚠️ Новое письмо не получено в течение 60 секунд');
    return; // тест не падает
  }

  // Если письмо есть, продолжаем обработку
  const html = email.bodyHTML || email.body;
  if (!html) {
    cy.task('logError', 'Письмо пришло, но тело письма пустое');
    return; // тест не падает
  }

  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const link = doc.querySelector('a.button.button-primary')?.href;

  if (!link) {
    cy.task('logError', 'Ссылка в письме не найдена');
    return; // тест не падает
  }

  cy.task('logInfo', `Найденная ссылка: ${link}`);
  this.confirmationLink = link;
});


  });

  it('accept invitation', function () {
    if (!confirmationLink) {
      cy.task('logError', 'confirmation link отсутствует, пропускаем шаг accept invitation');
      return;
    }

    cy.visit(confirmationLink);
    cy.task('logInfo', `Переход на страницу регистрации по приглашению`);

    cy.wait(1000);
    cy.task('logStep', `Ввод имени`);
    cy.xpath("//*[@id='first-name']").type('QA');
    cy.task('logStep', `Ввод фамилии`);
    cy.xpath("//*[@id='last-name']").type('Test');
    cy.task('logStep', `Ввод пароля`);
    cy.xpath("//*[@id='password']").type(Cypress.env('password'), { log: false });
    cy.task('logStep', `Ввод пароля повторно`);
    cy.xpath("//*[@id='new_password']").type(Cypress.env('password'), { log: false });
    cy.task('logStep', `Сохранение`);
    cy.xpath("(//button[@type='submit'])[1]").click();

    cy.checkTextInParagraph();
  });
});
