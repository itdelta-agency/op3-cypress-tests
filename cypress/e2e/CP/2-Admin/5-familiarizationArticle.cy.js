describe("CP5. Familiarization with the article", () => {

  const article = Cypress.env('articleName');

  beforeEach(function () {
    cy.resetAppState();
    cy.logTestName.call(this);
    cy.login();
    cy.changeLang();
  });

  it('checking the ignorance of the article ADMIN', () => {
    cy.task('logStep', 'Перехаод на страницу "Регламенты" с юзера, для ознакомления со статьей');
    cy.visit('/cp');
    cy.wait(500);

    cy.xpath('//div[text()="Not acquainted"]').click();
    cy.wait(500);

    cy.xpath(`//a[text()="${article}"]`).click();

    cy.wait(500);
    cy.task('logStep', 'Ответы на вопросы статьи');

    cy.xpath("//label[text()='Answer 3']").click();
    cy.wait(300);
    cy.xpath("//button[text()='Next']").click();
    cy.wait(500);
    cy.xpath("//label[text()='Answer 2']").click();
    cy.wait(300);
    cy.xpath("//button[text()='Next']").click();
    cy.wait(300);
    cy.xpath("//label[text()='Answer 1']").click();
    cy.wait(300);
    cy.xpath("//button[text()='Check it']").click();
    cy.wait(300);

    cy.xpath("//span[text()='Acquainted']", { timeout: 5000 }).should('be.visible');
    cy.task('logInfo', 'Пользователь ознакомлен со статьей ');
    cy.wait(500);

  });


  // ПОКА ЧТО НЕ ДОСТУПНО
  // it('checking the ignorance of the article USER', () => {
  //   cy.login('mytest123@mail.ru', '123456');
  //   cy.visit('/cp');
  //
  //   cy.xpath('//div[text()="Not acquainted"]').click();
  //   cy.wait(500);
  //
  //   cy.xpath(`//a[text()="${article}"]`).click();
  //
  //   cy.wait(500);
  //
  //   cy.xpath("//label[text()='Answer 1']").click();
  //   cy.xpath("//button[text()='Next']").click();
  //   cy.wait(500);
  //   cy.xpath("//label[text()='Answer 3']").click();
  //   cy.xpath("//button[text()='Check it']").click();
  //   cy.wait(500);
  //
  //   cy.xpath("//div[text()='Congratulations!']", { timeout: 5000 }).should('be.visible');
  // });

});
