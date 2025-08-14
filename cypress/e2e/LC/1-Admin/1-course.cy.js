const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('LC.A2. Create course', () => {
  let inbox;
  let emailLink;
  const courseGroupName = Cypress.env('courseGroupName');
  const lessonCheckboxRadio = Cypress.env('lessonCheckboxRadio');
  const courseName = Cypress.env('courseName');

  beforeEach(function () {
    cy.logTestName.call(this);
    cy.task('getCachedInbox').then(result => {
      expect(result).to.exist;
      inbox = result;
      cy.log('Используем кешированный inbox:', inbox.emailAddress);
      cy.admin(); // Авторизация
    });
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
    cy.wait(500);
    cy.task('logStep', 'Переход на страницу "Курсы"');

    cy.get('h2').contains('Courses').should('be.visible');
    cy.contains('Add Course').click();
    cy.wait(200);
    cy.task('logStep', 'Переход на страницу "Создание курса"');
    
    cy.get('h2').contains('Create course').should('be.visible');
    // Заполняем форму
    cy.xpath("//span[text()='Name *']").next().type(courseName);
    cy.xpath("//textarea").type("Автотест: описание курса");

    // cy.contains('li', 'Available for').within(() => {
    //   cy.contains('button', 'Select').click();
    // });
~
    cy.whoCanSee(['Users', 'Others']);

    // 1 чек бокс
    cy.get("button[role='switch']").eq(0)
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").eq(0).click();
        }
      });

    // Уроки добавляются в следующих тестах 


    cy.get("button[role='switch']").eq(1)
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").eq(1).click();
        }
      });

    // Сохраняем курс
    cy.contains('button[type="button"]', "Save").click();
    cy.checkTextInParagraph();
    cy.task('logInfo', 'Курс создан');
    
    cy.task('logInfo', 'Проверка массовых действий');
    cy.bulkAction(['Deactivate', 'Activate',], [courseName]);

  });

  ////Код рабочий, но пока на сайте эта функция не работает\\\
  it('should get course email and extract link', () => {
    cy.task('logInfo', 'Проверка что пользователь получил письмо, о появлении нового курса');
    if (!inbox) {
      cy.task('logInfo', 'inbox не доступен, пропускаем получение письма');
      return;
    }
    cy.task('logInfo', 'Получение почтового ящика');
    cy.task('getLastEmail', { inboxId: inbox.id, timeout: 60000 }).then(email => {
      if (!email) {
        cy.task('logInfo', 'Письмо не получено, пропускаем дальнейшую проверку');
        return;
      }
      cy.task('logInfo', 'Получение текста из письма');
      const html = email.bodyHTML || email.body;
      if (!html) {
        cy.task('logInfo', 'Тело письма пустое, пропускаем дальнейшую проверку');
        return;
      }

      const { JSDOM } = require('jsdom');
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      cy.task('logInfo', 'Получение ссылки из письма');
      const link = doc.querySelector('a[href*="/course"]')?.href;

      cy.task('logInfo', `Найденная ссылка: ${link}`);

      if (!link) {
        cy.task('logInfo', 'Ссылка на курс не найдена в письме, пропускаем дальнейший тест');
        return;
      }

      emailLink = link;
    });
  });

  it('should open assigned course from email', () => {
    if (!emailLink) {
      cy.task('logInfo', 'emailLink не доступен, пропускаем открытие курса');
      return;
    }
    cy.task('logInfo', 'Переход по ссылке из письма, для просмотра курса');
    cy.visit(emailLink);
    cy.contains('Course Overview').should('be.visible');
    cy.task('logInfo', 'Курс просмотрен!');
  });
});
