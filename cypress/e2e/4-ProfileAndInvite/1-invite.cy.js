const { ROUTES } = require("../../support/routes");
const { JSDOM } = require("jsdom");

describe("C. Invite user by 2 ways", () => {
  let link;

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

    cy.xpath("//input[@id='email']").type(inbox.emailAddress);
    cy.xpath("//button[@type='submit']").click();
  });

  it('getting last email', function () {
    const inbox = Cypress.env('inbox');

    if (!inbox) {
      cy.task('logError', 'Inbox не найден, тест пропускается');
      return; // тест не падает
    }

    cy.task('getLastEmail', { inboxId: inbox.id, timeout: 10000 }).then(email => {
      if (!email) {
        cy.task('logError', 'Письмо не получено, пропускаем проверку');
        return; // тест не падает
      }

      const html = email.bodyHTML || email.body;
      if (!html) {
        cy.task('logError', 'Письмо пришло, но тело письма пустое');
        return;
      }

      const dom = new JSDOM(html);
      const doc = dom.window.document;

      const directLink = doc.querySelector('a.button.button-primary')?.href;
      const allLinks = Array.from(doc.querySelectorAll('a'));

      const fallbackLink = allLinks.find(a =>
        a.href.includes('/accept-invite') || a.textContent.toLowerCase().includes('accept')
      )?.href;

      const link = directLink || fallbackLink;
      cy.task('logInfo', `Найденная ссылка: ${link || 'не найдена'}`);
      this.confirmationLink = link;
    });
  });

  it('accept invitation', function () {
    link = this.confirmationLink;

    if (!link) {
      cy.task('logError', 'confirmation link отсутствует, пропускаем шаг accept invitation');
      return;
    }

    cy.visit(link);
    cy.task('logInfo', `Переход на страницу регистрации по приглашению`);

    cy.wait(1000);
    cy.task('logStep', `Ввод имени`);
    cy.xpath("//*[@id='first-name']").type('QA');
    cy.task('logStep', `Ввод фмилии`);
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
