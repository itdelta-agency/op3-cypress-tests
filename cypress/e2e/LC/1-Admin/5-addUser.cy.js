import { ROUTES } from '../../../support/routes';
// console.log('ROUTES:', ROUTES);

describe("US.1 Add User", () => {

  let authEmail;
  let authPassword;
  let firstName = 'QA';
  let lastName = 'USER';
  let fullName = firstName + ' ' + lastName;
  let editUserFirstName = firstName + ' ' + "Edit";
  let actualUserName = '';




  beforeEach(function () {
    cy.logTestName.call(this);
    return cy.resetAppState()
      .then(() => cy.login())
      .then(() => {
        authEmail = Cypress.env('authEmail');
        authPassword = Cypress.env('authPassword');
      
      });
  });

  before(() => {
    cy.admin();
  })



  it('Add user', function () {

    cy.visit(ROUTES.createUser);
    cy.task('logStep', 'Переход на стараницу "Создания пользователя"');

    cy.get('.shadow-sm').eq(0).should('be.visible').type(firstName);
    cy.get('.shadow-sm').eq(1).should('be.visible').type(lastName);
    cy.get('.shadow-sm').eq(2).should('be.visible').type(authEmail);
    cy.get('.shadow-sm').eq(3).should('be.visible').type('+7 999 999 99 99');
    cy.get('.shadow-sm').eq(4).should('be.visible').type(authPassword);
    cy.get('.shadow-sm').eq(5).should('be.visible').type(authPassword);

    cy.get("button[role='switch']").eq(0)
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").eq(0).click();
        }
      });

    cy.xpath('//input[@id="avatar"]').should('exist').selectFile('cypress/image/qaUser.jpg', { force: true });

    // cy.whoCanSee(['Teams']);
    cy.get('.sm\\:col-start-3').click();
    cy.wait(1000);

    // Проверяем, есть ли сообщение об ошибке
    cy.get('body', { timeout: 10000 }).then(($body) => {
      if ($body.text().includes('The E-mail has already been taken.')) {
        cy.task('logError', 'Пользователь уже существует!');
        actualUserName = editUserFirstName;
        cy.wait(2000);
        cy.get('.sm\\:col-start-1').click();
      } else {
        actualUserName = fullName;
        cy.location('pathname', { timeout: 10000 }).should('include', '/user');
        cy.checkTextInParagraph();
        cy.task('logInfo', 'Пользователь создан');
      }

      cy.wait(2000); // по необходимости
      cy.bulkAction(['Deactivate', 'Activate'], actualUserName);
    });
  });



  it('check add User by search', () => {
    cy.task('logStep', 'Переход на страницу "Пользователи" для проверки, что пользователь создан');
    cy.visit(ROUTES.users);
    // cy.changeLang('en');
    cy.wait(1000);
    cy.searchRow(actualUserName);

    cy.wait(1000);
    cy.get('input[placeholder="Search"]').eq(1)
      .should('be.visible')
      .click()
      .type(authEmail, { delay: 100 });
    cy.wait(1000);
    cy.get('table tbody tr')
      .contains(authEmail)
      .should('be.visible')
      .then(($cell) => {
        const cellText = $cell.text().trim();
        expect(cellText).to.eq(authEmail);
      });
    cy.task('logInfo', 'Пользователь отображается в списке пользователей!');
  });


  it('edite User', () => {
    let editPassword = 123 + authPassword;

    cy.task('logStep', 'Переход на страницу "Пользователи"');
    cy.visit(ROUTES.users);
    // cy.changeLang('en');
    cy.accessAllItems();
    cy.wait(1000);

    cy.searchRow(actualUserName);
    // Вводим в инпут, который должен быть видим
    cy.get('input[placeholder="Search"]').eq(1)
      .should('be.visible')
      .click()

      .type(authEmail, { delay: 100 });
    cy.wait(1000);

    cy.contains('table tbody tr', authEmail)
      .should('be.visible')
      .within(() => {
        // Кликаем по колонке "Имя"
        cy.get('th').eq(3).click();  // если имя в первом столбце
      });
    cy.task('logInfo', 'Выбрали пользователя для редактирования');

    cy.wait(2000);
    cy.get('.shadow-sm').eq(0).should('be.visible').clear().type(editUserFirstName);
    cy.get('.shadow-sm').eq(1).should('be.visible').clear().type(lastName);
    cy.get('.shadow-sm').eq(2).should('be.visible').clear().type(authEmail);
    cy.get('.shadow-sm').eq(3).should('be.visible').clear().type('+7 999 999 99 99');
    cy.get('.shadow-sm').eq(4).should('be.visible').clear().type(editPassword);
    cy.get('.shadow-sm').eq(5).should('be.visible').clear().type(editPassword);

    cy.get("button[role='switch']").eq(0)
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").eq(0).click();
        }
      });

    cy.get('.sm\\:col-start-3').click();
    cy.wait(1000);


    cy.get('body', { timeout: 10000 }).then(($body) => {
      if ($body.text().includes('The E-mail has already been taken.')) {
        cy.log('Пользователь уже существует');
        cy.get('.sm\\:col-start-1').click();
      } else {
        cy.location('pathname', { timeout: 10000 }).should('include', '/user');
        cy.checkTextInParagraph();
        cy.task('logInfo', 'Пользователь успешно отредактирован!');
      }
    });
  });

  // ---------------------------------------------------------------------------------------
  // it('check user team/departments', () => {
  //   cy.visit(ROUTES.teams);

  //   cy.searchRow(teemName);
  //   actualUserName = editUserFirstName + ' ' + lastName;

  //   cy.wait(1000); // чтобы таблица обновилась после поиска
  //   cy.contains('table tbody tr', teemName)
  //     .should('be.visible')
  //     .within(() => {
  //       cy.get('th').eq(2).click();
  //     });
  //   cy.wait(1000);
  //   // cy.get('.px-4.py-3.rounded-md').eq(3).click()
  //   //   .contains(actualUserName)
  //   //   .should('exist');

  //   // // Навигация по командам с ожиданием элементов
  //   cy.visit(ROUTES.teams);
  //   cy.accessAllItems();

  //   cy.xpath("//div[contains(text(),'Qa Test Team')]")
  //     .should('be.visible')
  //     .click({ multiple: true });

  // });
});