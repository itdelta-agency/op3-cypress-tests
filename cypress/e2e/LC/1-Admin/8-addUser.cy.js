import { ROUTES } from '../../../support/routes';
console.log('ROUTES:', ROUTES);

describe("US.1 Add User", () => {

  let authEmail;
  let authPassword;
  let teemName;



  beforeEach(() => {
    return cy.resetAppState()
      .then(() => cy.login())
      .then(() => {
        authEmail = Cypress.env('authEmail');
        authPassword = Cypress.env('authPassword');
        teemName = Cypress.env('teemName');
      });
  });

  // afterEach(() => {
  //     cy.resetAppState();
  // });



  it('Add user', function () {

    cy.visit(ROUTES.createUser);

    cy.changeLang('ru');


    // cy.get('.bg-indigo-800', { timeout: 10000 }).should('be.visible').click();

    // cy.log("Нажал кнопку  \"Создать пользователя\"");
    // // Клик по кнопке "Создать пользователя"
    // cy.get('.text-white.bg-indigo-600').eq(0).should('be.visible').click();

    cy.xpath("//span[text()='Имя *']").should('be.visible').next().type('QA');
    cy.xpath("//span[text()='Фамилия']").should('be.visible').next().type('USER');
    cy.xpath("//span[text()='Почта *']").should('be.visible').next().type(authEmail);
    cy.xpath("//span[text()='Телефон']").should('be.visible').next().type('+7 999 999 99 99');
    cy.xpath("//span[text()='Пароль *']").should('be.visible').next().type(authPassword);
    cy.xpath("//span[text()='Повторите пароль *']").should('be.visible').next().type(authPassword);

    cy.get('button[role="switch"]').eq(0).click();

    cy.xpath('//input[@id="avatar"]').should('exist').selectFile('cypress/image/qaUser.jpg', { force: true });

    cy.xpath("//button[text()='Выбрать']").should('be.visible').click();
    cy.xpath("(//div[text()='Команды'])").should('be.visible').click();
    cy.contains("Выбрать: Команды").parent().next().should('be.visible').click();
    cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/div/div[1]/div[2]/input")
      .should('be.visible').type('Qa');
    cy.xpath("//div[text()='Qa Test Team']").scrollIntoView().should('be.visible').click();
    // cy.contains("Выбрать: Команды").parent().next().next().next().should('be.visible').click();

    cy.log("Сохранение в модалке \"принадлежит\"");
    cy.get('.mt-3.w-full.inline-flex').click();
    cy.log("Сохранение пользователя");
    cy.get('button.bg-indigo-600.text-white').eq(1).click();
    cy.wait(1000);


    cy.checkTextPresence('Такое значение поля Почта уже существует.').then((exists) => {
      if (exists) {
        cy.log('⚠️ Пользователь уже существует');
        cy.get('.sm\\:col-start-1').click();
        cy.location('pathname').should('include', '/user');
      } else {
        cy.location('pathname', { timeout: 10000 }).should('include', '/user');
        cy.contains('Пользователь успешно создан!').should('be.visible');
        cy.log('✅ Пользователь создан');
      }
    });
  });


  it('check add User by search', () => {
    cy.visit(ROUTES.users);
    cy.changeLang('en');
    cy.wait(1000);
    cy.get('input[placeholder="Search"]').eq(1).then($input => {
      if ($input.length === 0) {
        // Инпут не найден — кликаем по кнопке, чтобы открыть поиск
        cy.get('.flex.gap-10.inline-flex', { timeout: 1000 }).click();
        cy.wait(1000);
      } else {
        // Инпут есть — ничего не делаем
      }
    });

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
  });



  it('edite User', () => {

    cy.visit(ROUTES.users);
    cy.changeLang('en');
    cy.accessAllItems();
    cy.wait(1000);
    cy.get('input[placeholder="Search"]').eq(1).then($input => {
      if ($input.length === 0) {
        // Инпут не найден — кликаем по кнопке, чтобы открыть поиск
        cy.get('.flex.gap-10.inline-flex', { timeout: 1000 }).click();
        cy.wait(1000);
      } else {
        // Инпут есть — ничего не делаем
      }
    });

    // Далее вводим в инпут, который должен быть видим
    cy.get('input[placeholder="Search"]').eq(1)
      .should('be.visible')
      .click()
      .type(authEmail, { delay: 100 });
    cy.wait(1000);

    cy.contains('table tbody tr', authEmail)
      .should('be.visible')
      .within(() => {
        // Кликаем по колонке "Имя"
        // Обычно имя в первой или второй ячейке строки, например:
        cy.get('th').eq(3).click();  // если имя в первом столбце
        // или если в другом — поменяй индекс
      });

    let editUserEmail = "Edit" + authEmail;
    let editPassword = 123 + authPassword;
    cy.wait(1000);
    cy.changeLang('ru');
    cy.wait(2000);
    cy.xpath("//span[text()='Имя *']").should('be.visible').next().clear().type('QA');
    cy.xpath("//span[text()='Фамилия']").should('be.visible').next().clear().type('USER');
    cy.xpath("//span[text()='Почта *']").should('be.visible').next().clear().type(editUserEmail);
    cy.xpath("//span[text()='Телефон']").should('be.visible').next().clear().type('+7 999 999 99 99');
    cy.xpath("//span[text()='Пароль *']").should('be.visible').next().clear().type(editPassword);
    cy.xpath("//span[text()='Повторите пароль *']").should('be.visible').next().clear().type(editPassword);

    // cy.get('button[role="switch"]').eq(0).click();

    // cy.xpath('//input[@id="avatar"]').should('exist').selectFile('cypress/image/qaUser.jpg', { force: true });

    // cy.xpath("//button[text()='Выбрать']").should('be.visible').click();
    // cy.xpath("(//div[text()='Команды'])").should('be.visible').click();
    // cy.contains("Выбрать: Команды").parent().next().should('be.visible').click();
    // cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/div/div[1]/div[2]/input")
    //   .should('be.visible').type('Qa');
    // cy.xpath("//div[text()='Qa Test Team']").scrollIntoView().should('be.visible').click();
    // cy.log("Сохранение в модалке \"принадлежит\"");
    // cy.get('.mt-3.w-full.inline-flex').click();
    cy.log("Сохранение пользователя");
    cy.get('button.bg-indigo-600.text-white').eq(1).click();
    cy.wait(1000);


    cy.checkTextPresence('Такое значение поля Почта уже существует.').then((exists) => {
      if (exists) {
        cy.log('⚠️ Пользователь уже существует');
        cy.get('.sm\\:col-start-1').click();
        cy.location('pathname').should('include', '/user');
      } else {
        cy.location('pathname', { timeout: 10000 }).should('include', '/user');
        cy.contains('Пользователь успешно обновлён!').should('be.visible');
        cy.log('✅ Пользователь обновлен.');
      }
    });
  });

  it('check user team/departments', () => {
    cy.visit(ROUTES.teams);
    cy.changeLang('en');

    cy.get('input[placeholder="Search"]').eq(1).then($input => {
      if ($input.length === 0) {
        // Инпут не найден — кликаем по кнопке, чтобы открыть поиск
        cy.get('.flex.gap-10.inline-flex', { timeout: 1000 }).click();
        cy.wait(1000);
      } else {
        // Инпут есть — ничего не делаем
      }
    });

    // Далее вводим в инпут, который должен быть видим
    cy.get('input[placeholder="Search"]').eq(0)
      .should('be.visible')
      .click()
      .type(teemName, { delay: 50 });
    cy.wait(1000); // чтобы таблица обновилась после поиска
    cy.contains('table tbody tr', teemName)
      .should('be.visible')
      .within(() => {
        // Кликаем по колонке "Имя"
        // Обычно имя в первой или второй ячейке строки, например:
        cy.get('th').eq(2).click();  // если имя в первом столбце
        // или если в другом — поменяй индекс
      });
    cy.wait(1000);
    cy.get('.css-9jq23d').contains('QA USER')

    // // Навигация по командам с ожиданием элементов
    cy.visit(ROUTES.teams);
    cy.accessAllItems();

    cy.xpath("//div[text()='Qa Test Team']").should('be.visible').click();

    // Проверка, что пользователь есть в команде
    cy.xpath("//span[text()='Users']").next().contains('QA USER').should('be.visible');
  });
});