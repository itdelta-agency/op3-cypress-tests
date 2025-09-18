const { ROUTES } = require("../../../support/routes");

describe("CP3. Article List", () => {

  let articleName = Cypress.env('articleName');
  const userNames = Cypress.env('usersArticle');

  beforeEach(function () {
    cy.resetAppState();
    cy.logTestName.call(this);
    cy.admin();
    // cy.changeLang();
  });





  it('Deactivate Article', function () {
    cy.task('logStep', 'Переход на страницу "Статьи" для деактивации');
    cy.visit(ROUTES.articles);
    cy.get('h2').contains('Articles').should('be.visible');
    cy.task('logInfo', 'Деактивация статьи');
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
    cy.xpath('//button[text()="Save & Close"]').click();
    cy.task('logInfo', 'Статья деактивированна');
    cy.checkTextInParagraph();
    cy.clearCookies();
  });

  it('Check deactive article', function () {
    cy.task('logStep', 'Переход на страницу "Отчет" для проверки');
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

    cy.contains('div', 'No options').should('be.visible');
    cy.task('logInfo', 'Деактивированная статья не отображается в отчете');
  });




  it('Activate Article', function () {
    cy.task('logStep', 'Переход на страницу статьи, для активации');
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
    cy.xpath('//button[text()="Save & Close"]').click();
    cy.task('logInfo', 'Статья активированна');
    cy.checkTextInParagraph();
  })


  it('check Active Article', function () {
    cy.task('logInfo', 'Переход на страницу "Отчет", для проверки активации статьи');
    cy.login()
    cy.visit(ROUTES.report);
    cy.wait(1000);
    cy.whoCanSee(['Users']);

    cy.get('.px-3.py-1').click();

    cy.get('.grid.grid', { timeout: 30000 }).should('be.visible');
    cy.xpath(`//div[text()='${userNames}']`).next().scrollIntoView()
      .click().type(articleName);
    cy.wait(500);
    cy.task('logInfo', 'Активная статья отображается в отчете');
    cy.contains('div', articleName).should('be.visible');
  })

})
