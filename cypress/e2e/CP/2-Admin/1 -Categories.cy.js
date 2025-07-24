const { ROUTES } = require("../../../support/routes");

describe("CP1. Categories List", () => {
  let catName = Cypress.env('categoryName');

  beforeEach(() => {
    cy.admin();
  });

  it('should create Category)', function () {

    cy.get('.flex.justify-between', { timeout: 10000 }).eq(1).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
      }
    });
    cy.get('a.text-indigo-100',).eq(0).click();

    cy.wait(500);

    cy.contains('Add category').click();

    // create post
    cy.get('ul li:first input').type(catName);
    cy.get("button[role='switch']")
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'true') {
          cy.get("button[role='switch']").click();
        }
      });
    cy.get('input[type="number"]').clear().type(222);
    cy.whoCanSee(['Users', 'Teams', 'Others']);
    cy.get(".sm\\:col-start-3").should('be.visible').click();
    cy.wait(500);
    cy.contains("Success!").should('be.visible');

    // check active
    cy.contains('div', 'QA Test Category')
      .parents('tr')
      .within(() => {
        cy.contains('span', 'Inactive').should('exist');
      });
  });

  it('should edit Category)', function () {

    cy.visit(ROUTES.categories);

    // cy.accessAllItems();
    cy.xpath(`(//div[text()='${catName}'])`).click();
    //
    cy.contains('Edit category');

    cy.get("button[role='switch']")
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false' || checked === undefined) {
          cy.get("button[role='switch']").click();
        }
      });

    cy.xpath("//button[text()='Save & Close']").should('be.visible').click();
    cy.wait(1000);

    cy.xpath("//p[text()='Success!']").should('be.visible');

    cy.contains('div', 'QA Test Category')
      .parents('tr')
      .within(() => {
        cy.contains('span', 'Active').should('exist');
      });

  });

  after(() => {
    cy.clearCookies();
  });

});
