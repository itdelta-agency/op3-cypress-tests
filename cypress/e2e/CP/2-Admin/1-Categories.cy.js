const { should } = require("chai");
const { ROUTES } = require("../../../support/routes");

describe("CP1. Categories List", () => {
  let catName = Cypress.env('categoryName');

  beforeEach(function () {
    cy.resetAppState();
    cy.logTestName.call(this);
    cy.admin();
  });


  it('should create Category)', function () {
    cy.task('logInfo', 'Создание новой категории');

    cy.get('.flex.justify-between', { timeout: 15000 }).eq(1)
      .should('be.visible') // ждём пока элемент видим
      .then($tab => {
        const isExpanded = $tab.attr('aria-expanded') === 'true';
        if (!isExpanded) {
          cy.wrap($tab).click();
          cy.task('logInfo', 'Вкладка категорий скрыта, клик на "Регламенты"');
        }
      });

    // Кликаем на первый линк
    cy.get('a.text-indigo-100').eq(0)
      .should('be.visible')
      .click();  

    // cy.searchRow(catName);
    // cy.wait(500);

    // cy.ifRowExists(catName, () => {
    //   cy.deleteResources(catName);
    // });

    cy.contains('Add category').should('be.visible').click();
    cy.task('logStep', 'Переход на страницу создания категорий');

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
    cy.wait(500);
    cy.whoCanSee(['Users', 'Teams', 'Others']);
    cy.get(".sm\\:col-start-3").should('be.visible').click();
    cy.wait(500);

    cy.checkTextInParagraph();
    cy.wait(1000);

    // check active
    cy.task('logInfo', 'Проверка ативности');
    cy.searchRow(catName);
    cy.wait(500);
    cy.contains('div', 'QA Test Category')
      .parents('tr')
      .within(() => {
        cy.contains('span', 'Inactive').should('exist');
        cy.task('logInfo', 'Категория активна!');
      });
  });

  it('should edit Category)', function () {
    cy.task('logStep', 'Переход к редактированию категории');
    cy.get('.flex.justify-between', { timeout: 10000 }).eq(1).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
        cy.task('logInfo', 'Вкладка категорий скрыта, клик на "Регламенты"');
      }
    });
    cy.wait(1000);
    cy.get('a.text-indigo-100',).eq(0).click();
    cy.visit(ROUTES.categories);

    // cy.accessAllItems();
    cy.xpath(`(//div[text()='${catName}'])`).click();
    //
    cy.contains('Edit category');

    cy.get("button[role='switch']")
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").click();
        }
      });

    cy.xpath("//button[text()='Save & Close']").should('be.visible').click();
    cy.wait(500);
    cy.checkTextInParagraph();

    cy.searchRow(catName);
    cy.contains('div', 'QA Test Category')
      .parents('tr')
      .within(() => {
        cy.contains('span', 'Active').should('exist');
      });
    cy.task('logInfo', 'Категория отредактирована и активна!');


  });


});
