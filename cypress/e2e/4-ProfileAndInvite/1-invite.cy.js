const { ROUTES } = require("../../support/routes");

describe("C. Invite user by 2 ways", () => {
  let inbox;
  let confirmationLink;

  before(() => {
    // Получаем inbox один раз
    cy.task('getLastInbox').then(result => {
      expect(result).to.exist;
      inbox = result;
      cy.log(' Используем inbox:', inbox.emailAddress);
    });
  });

  it('should invite by user menu', () => {
    cy.admin();
    cy.visit(ROUTES.invite);

    cy.xpath("//input[@id='email']").type(inbox.emailAddress);
    cy.xpath("//button[@type='submit']").click();
    cy.xpath("//p[text()='Success!']").should('be.visible');
  });

 it('getting last email', () => {
  expect(inbox).to.exist;

  cy.task('getLastEmail', { inboxId: inbox.id, timeout: 60000 }).then(email => {
  try {
    const html = email.bodyHTML || email.body;
    expect(html).to.exist;

    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const directLink = doc.querySelector('a.button.button-primary')?.href;

    let fallbackLink;
    if (!directLink) {
      const allLinks = Array.from(doc.querySelectorAll('a'));
      fallbackLink = allLinks.find(a =>
        a.href.includes('/accept-invite') ||
        a.textContent.toLowerCase().includes('accept')
      )?.href;

      allLinks.forEach((a, i) => {
        cy.log(`🔗 [${i}] ${a.textContent} => ${a.href}`);
      });
    }

    const link = directLink || fallbackLink;
    cy.log('✅ Найденная ссылка:', link);
    expect(link, 'confirmation link').to.exist;

    confirmationLink = link;
  } catch (error) {
    // Логируем ошибку, чтобы видеть причину сбоя
    cy.log('Ошибка при парсинге письма:', error.message);
    throw error; // или просто fail тест явно
  }
});
});


  it('accept invitation', () => {
    expect(confirmationLink, 'confirmation link before visit').to.exist;
    cy.visit(confirmationLink);

    cy.xpath("//*[@id='first-name']").type('QA');
    cy.xpath("//*[@id='last-name']").type('Test');
    cy.xpath("//*[@id='password']").type(Cypress.env('password'), { log: false });
    cy.xpath("//*[@id='new_password']").type(Cypress.env('password'), { log: false });

    cy.xpath("(//button[@type='submit'])[1]").click();
    cy.contains("You have registered successfully!").should('be.visible');
  });
});
