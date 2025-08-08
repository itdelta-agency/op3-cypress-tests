const { ROUTES } = require("../../support/routes");
const { JSDOM } = require("jsdom");

describe("C. Invite user by 2 ways", () => {
  let inbox;

  beforeEach(function () {
    cy.logTestName.call(this);
    cy.resetAppState();

    cy.task('getCachedInbox').then(result => {
      expect(result).to.exist;
      inbox = result;
      cy.log('Используем кешированный inbox:', inbox.emailAddress);
    });
  });

  it('should invite by user menu', () => {
    cy.admin();

    cy.visit(ROUTES.invite);

    cy.xpath("//input[@id='email']").type(inbox.emailAddress);
    cy.xpath("//button[@type='submit']").click();
  });

  it('getting last email', function () {
    expect(inbox).to.exist;

    cy.task('getLastEmail', { inboxId: inbox.id, timeout: 60000 }).then(email => {
      if (!email) {
        cy.task('logInfo', 'Письмо не получено, пропускаем дальнейшую проверку');
        return;
      }

      const html = email.bodyHTML || email.body;
      expect(html).to.exist;

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
      cy.log('Найденная ссылка:', link);
      expect(link, 'confirmation link').to.exist;

      this.confirmationLink = link;
    });
  });

  it('accept invitation', function () {
    const link = this.confirmationLink;

    if (!link) {
      cy.log('confirmation link отсутствует, пропускаем шаг accept invitation');
      return;
    }

    cy.visit(link);
    cy.wait(1000);

    cy.xpath("//*[@id='first-name']").type('QA');
    cy.xpath("//*[@id='last-name']").type('Test');
    cy.xpath("//*[@id='password']").type(Cypress.env('password'), { log: false });
    cy.xpath("//*[@id='new_password']").type(Cypress.env('password'), { log: false });

    cy.xpath("(//button[@type='submit'])[1]").click();

    cy.checkTextInParagraph();
  });
});
