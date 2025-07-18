const { ROUTES } = require("../../../support/routes");

describe("CP3. Article List", () => {

  let articleName = Cypress.env('articleName');
  const userNames = Cypress.env('usersArticle');

  before(() => {
    cy.clearCookies();
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
    cy.xpath(`//div[text()="${articleName}"]`).click();
    cy.wait(500);
    cy.xpath('//span[text()="Status"]/../span[2]/button').click();
    cy.wait(500);
    cy.xpath('//button[text()="Save"]').click();
    cy.wait(500);
    cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
    cy.clearCookies();
  });

it('Check deactive article', function () {
  cy.login();
  cy.wait(2000);
  cy.visit(ROUTES.report);
  cy.wait(2000);

  // Поиск и фильтрация по пользователю
  cy.searchReport(); // ты уже реализовал эту команду

  cy.wait(2000);

cy.xpath(`//div[text()='${userNames}']`)
  .next()
  .scrollIntoView()
  .click()
  .type(articleName)
  .contains('div', articleName)
  .should('not.exist');
  });




  it('Activate Article', function () {
    cy.login()
    cy.visit(ROUTES.articles);
    cy.wait(2000);
    cy.searchRow('QA');
    cy.xpath(`//div[text()="${articleName}"]`).click();
    cy.wait(500);
    cy.xpath('//span[text()="Status"]/../span[2]/button').click();
    cy.wait(500);
    cy.xpath('//button[text()="Save"]').click();
    cy.wait(500);
    cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
  })


  it('check Active Article', function () {
    cy.login()
    cy.visit('/cp/admin/report');
    cy.wait(2000);
    cy.searchReport();

    cy.wait(3000);
    cy.xpath(`//div[text()='${userNames}']`).next().scrollIntoView().click().type(articleName).contains('div', articleName).should('be.visible');;
    cy.wait(500);
  })

})
