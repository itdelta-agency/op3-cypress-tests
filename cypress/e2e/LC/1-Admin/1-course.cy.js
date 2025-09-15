const mailhog = require('../../../support/mailhog-client');



describe('LC.A2. Create course', () => {

  let emailLink;
  const courseGroupName = Cypress.env('courseGroupName');
  const lessonCheckboxRadio = Cypress.env('lessonCheckboxRadio');
  const courseName = Cypress.env('courseName');


  before(() => {
    // Глобальная настройка inbox, если нужно
    const inboxEmail = Cypress.env('REGISTRATION_EMAIL') || 'test@example.com';
    Cypress.env('inboxEmail', inboxEmail);
    cy.log('📬 Используем inbox:', inboxEmail);
  });

  beforeEach(function () {
    cy.logTestName.call(this);
    // cy.resetAppState();
    cy.admin();
  });



  it('should create course and assign user', () => {
    // Проверяем, что переменные заданы
    expect(courseGroupName, 'courseGroupName').to.exist;
    expect(lessonCheckboxRadio, 'lessonCheckboxRadio').to.exist;
    expect(courseName, 'courseName должен быть задан').to.exist;

    cy.get('.flex.justify-between', { timeout: 20000 }).eq(2).then($tab => {
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

    // cy.whoCanSee(['Users', 'Others']);

    // Если нужно указать кого конкретно выбрать
    cy.whoCanSee(
      ['Users', 'Others'],
      {
        'Users': 'QA',
        'Others': 'All users'
      })

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




  it('should get course email and extract link', () => {
    cy.task('logInfo', 'Проверка, что пользователь получил письмо о новом курсе');

    cy.task('getLastEmail', { timeout: 90000 }).then(email => {
      if (!email) return cy.task('logError', 'Письмо не получено');

      cy.task('logInfo', `Получено письмо: ${email.subject}, body length: ${email.body.length}`);

      // Поиск ссылки через mailhog-client
      const link = mailhog.extractConfirmationLink(email);
      if (!link) return cy.task('logError', 'Ссылка на курс в письме не найдена');

      emailLink = link;
      cy.task('logInfo', `Найденная ссылка на курс: ${link}`);
    });
  });

  it('should open assigned course from email', () => {
    if (!emailLink) {
      cy.task('logInfo', 'emailLink не доступен, пропускаем открытие курса');
      return;
    }

    cy.task('logInfo', 'Переход по ссылке из письма для просмотра курса');
    cy.visit(emailLink);
    cy.get('h2').contains('Regulations').should('be.visible')
    cy.get('.group.flex.items-center.px-2.py-2').eq(1).click();
    cy.get('h2').contains('Learning center').should('be.visible');
cy.contains('span', 'Courses without a group')
  .parent('button') // поднимаемся к родителю button
  .then($btn => {
    const expanded = $btn.attr('aria-expanded'); // читаем атрибут
    if (expanded === 'false') {
      cy.wrap($btn).click(); // раскрываем
    } else {
      cy.log('Элемент уже раскрыт, кликаем не нужно');
    }
  });

    cy.task('logInfo', 'Курс просмотрен!');
  });
});



