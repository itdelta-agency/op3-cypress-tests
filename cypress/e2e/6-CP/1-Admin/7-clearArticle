import { ROUTES } from "../../../support/routes";

describe("CP7. Clear Data", () => {
  let articleName = Cypress.env('articleName');
  let catName = Cypress.env('categoryName');


  beforeEach(function () {
    cy.resetAppState();
    cy.logTestName.call(this);
    cy.admin();
    // cy.changeLang();
  });

  

  it('should delete Category)', function () {
    cy.task('logStep', 'Преход на страницу "Категории" для удаления');
    cy.visit(ROUTES.categories);
    cy.get('h2').contains('Categories').should('be.visible');

    cy.searchRow(catName);
    cy.contains('tr', catName).within(() => {
      // Кликаем по кнопке меню (иконка с тремя полосками)
      cy.get('.p-2.rounded-full').click();
    });
    cy.task('logStep', 'Открытие меню категории');
    

    cy.contains('div', 'Delete category').click({ force: true });
    cy.contains('button', 'Delete').click();
    cy.checkTextInParagraph();
    cy.task('logInfo', 'Категория удалена');
  });

  it('delete articles', function () {
    
    cy.task('logStep', 'Перход на страницу "Статьи" для удаления статьи');
    cy.visit(ROUTES.articles);
    cy.get('h2').contains('Articles').should('be.visible');
    cy.searchRow(articleName);
    cy.contains('tr', articleName).within(() => {
      // Кликаем по кнопке меню (иконка с тремя полосками)
      cy.get('.p-2.rounded-full').click();
      cy.task('logStep', 'Открытие меню статьи ');
    });
    cy.wait(300);
    cy.contains('div', 'Delete article').click();
    cy.get('button[type="button"]').contains('Delete').click();
    cy.checkTextInParagraph();
    cy.task('logInfo', 'Статья удалена!');
  });
});