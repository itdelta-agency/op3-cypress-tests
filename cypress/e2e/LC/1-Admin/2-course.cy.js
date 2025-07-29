const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('LC.A2. Create course', () => {
  let inbox;
  let emailLink;
  const courseGroupName = Cypress.env('courseGroupName');
  const lessonCheckboxRadio = Cypress.env('lessonCheckboxRadio');
  const courseName = Cypress.env('courseName');

before(() => {
  // Получаем последний inbox один раз и кешируем
  cy.task('getLastInbox').then(result => {
    expect(result).to.exist;
    inbox = result;
    cy.log('Используем кешированный inbox:', inbox.emailAddress);
  });
});

  beforeEach(() => {
    cy.admin(); // Авторизация
  });

  it('should create course and assign user', () => {
    // Проверяем, что переменные заданы
    expect(courseGroupName, 'courseGroupName').to.exist;
    expect(lessonCheckboxRadio, 'lessonCheckboxRadio').to.exist;
    expect(courseName, 'courseName должен быть задан').to.exist;

    cy.get('.flex.justify-between', { timeout: 10000 }).eq(2).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
      }
    });
    cy.contains('Courses').click();

    cy.wait(200);
    
    cy.contains('Add Course').click();
    cy.wait(200);

    // Заполняем форму
    cy.xpath("//span[text()='Name *']").next().type(courseName);
    cy.xpath("//textarea").type("Автотест: описание курса");

    cy.contains('li', 'Available for').within(() => {
      cy.contains('button', 'Select').click();
    });


    // cy.contains('div', 'Users').click();
    const userName = 'first-name last-name';
    // cy.wait(1200);
    cy.contains('div', 'Search', { timeout: 10000 })
      .parent()
      .find('input')
      .type('first-name', { force: true });
    cy.contains('div', userName, { timeout: 5000 }).click({ force: true });
    cy.get('.mt-3.w-full').click();
    cy.contains('li', 'Available for').within(() => {
      cy.get('ul').should('contain', userName);
    });


    // Группа курса
    // cy.get('.css-hlgwow').eq(0).click().type(courseGroupName);

    // // Ждем появления опции с нужным значением и кликаем
    // cy.contains('div', courseGroupName, { timeout: 5000 })
    //   .should('be.visible')
    //   .click();

    // 1 чек бокс
    cy.get("button[role='switch']").eq(0)
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").eq(0).click();
        }
      });

    // Урок
    cy.get('.css-hlgwow').eq(1).click().type(lessonCheckboxRadio);

    cy.contains('div', lessonCheckboxRadio, { timeout: 5000 })
      .should('be.visible')
      .click();

    cy.get("button[role='switch']").eq(1)
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").eq(1).click();
        }
      });

    // Сохраняем курс
    cy.contains('button[type="button"]', "Save").click();

    // Проверяем успешное сохранение
    cy.contains("Success").should("be.visible");

    cy.bulkAction(['Deactivate', 'Activate',], [courseName]);

  });
    ////Код рабочий, но пока на сайте эта функция не работает\\\
//   it('should get course email and extract link', () => {
//   expect(inbox, 'inbox должен быть доступен').to.exist;

//   cy.task('getLastEmail', { inboxId: inbox.id, timeout: 60000 }).then(email => {
//     expect(email, 'Письмо должно быть получено').to.exist;

//     const html = email.bodyHTML || email.body;
//     expect(html, 'Тело письма должно быть не пустым').to.exist;

//     const { JSDOM } = require('jsdom');
//     const dom = new JSDOM(html);
//     const doc = dom.window.document;

//     // Ищем ссылку на курс в письме
//     const link = doc.querySelector('a[href*="/course"]')?.href;

//     cy.log('Найденная ссылка:', link);
//     expect(link, 'Ссылка на курс должна быть найдена в письме').to.exist;

//     emailLink = link;
//   });
// });

// it('should open assigned course from email', () => {
//   expect(emailLink, 'email link должен быть доступен').to.exist;

//   cy.visit(emailLink);

//   // Проверяем, что курс открылся (замени селектор на актуальный для твоего UI)
//   cy.contains('Course Overview').should('be.visible');
// });
});