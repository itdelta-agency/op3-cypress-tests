import { ROUTES } from "../../../support/routes";

describe("CP7. Clear Data", () => {
  let articleName = Cypress.env('articleName');
  let catName = Cypress.env('categoryName');

  beforeEach(() => {
    cy.resetAppState();
    cy.admin();
  });

  it('should delete Category)', function () {
    cy.get('.flex.justify-between', { timeout: 10000 }).eq(1).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
      }
    });
    cy.get('a.text-indigo-100',).eq(0).click();
    cy.wait(500);

    cy.searchRow(catName);
    cy.contains('tr', catName).within(() => {
      // Кликаем по кнопке меню (иконка с тремя полосками)
      cy.get('.p-2.rounded-full').click();
    });
    cy.wait(300);

    cy.contains('div', 'Delete category').click({ force: true });
    cy.contains('button', 'Delete').click();
    cy.checkTextInParagraph();
  });

  it('delete articles', function () {
    cy.visit(ROUTES.articles);
    cy.wait(500);
    cy.searchRow(articleName);
    cy.contains('tr', articleName).within(() => {
      // Кликаем по кнопке меню (иконка с тремя полосками)
      cy.get('.p-2.rounded-full').click();
    });
    cy.wait(300);
    cy.contains('div', 'Delete article').click();
    cy.get('button[type="button"]').contains('Delete').click();
    cy.checkTextInParagraph();
  });
});