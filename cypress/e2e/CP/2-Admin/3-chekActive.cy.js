const { ROUTES } = require("../../../support/routes");

describe("CP3. Article List", () => {

  let articleName = Cypress.env('articleName');
  const userNames = Cypress.env('usersArticle');

  beforeEach(function () {
    cy.logTestName.call(this);

    cy.admin();

  });



  it('Deactivate Article', function () {
    cy.get('.flex.justify-between', { timeout: 10000 }).eq(1).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
      }
    });
    cy.get('a.text-indigo-100',).eq(1).click();
    cy.wait(2000);

    cy.searchRow('QA');
    cy.xpath(`//div[text()="${articleName}"]`).first().click();
    cy.wait(500);
    cy.get("button[role='switch']")
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'true') {
          cy.get("button[role='switch']").click();
        }
      });
    cy.wait(500);
    cy.xpath('//button[text()="Save"]').click();
    cy.checkTextInParagraph();
    cy.clearCookies();
  });

  it('Check deactive article', function () {
    cy.login();
    cy.wait(2000);
    cy.visit(ROUTES.report);
    cy.wait(2000);

    // Поиск и фильтрация по пользователю
    cy.whoCanSee(['Users']);

    cy.wait(2000);
    cy.get('.px-3.py-1').click();

    cy.get('.grid.grid', { timeout: 55000 }).should('be.visible');
    cy.xpath(`//div[text()='${userNames}']`).next().scrollIntoView()
      .click().type(articleName);

    // Проверяем, что элемент с текстом articleName **не существует**
    cy.contains('div', 'No options').should('be.visible');
  });




  it('Activate Article', function () {
    cy.login()
    cy.visit(ROUTES.articles);
    cy.wait(1000);
    cy.searchRow('QA');
    cy.xpath(`//div[text()="${articleName}"]`).first().click();
    cy.wait(100);
    cy.get("button[role='switch']")
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").click();
        }
      });
    cy.wait(100);
    cy.xpath('//button[text()="Save"]').click();
    cy.checkTextInParagraph();
  })


  it('check Active Article', function () {
    cy.login()
    cy.visit('/cp/admin/report');
    cy.wait(1000);
    cy.get('.flex.justify-between', { timeout: 10000 }).eq(1).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
      }
    });
    cy.get('.bg-indigo-800').click();
    cy.wait(1000);
    cy.whoCanSee(['Users']);

    cy.get('.px-3.py-1').click();

    cy.get('.grid.grid', { timeout: 30000 }).should('be.visible');
    cy.xpath(`//div[text()='${userNames}']`).next().scrollIntoView()
      .click().type(articleName);
    cy.wait(500);
    cy.contains('div', articleName).should('be.visible');
  })

})
