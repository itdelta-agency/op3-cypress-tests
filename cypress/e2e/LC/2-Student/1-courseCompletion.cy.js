import { ROUTES } from "../../../support/routes";

describe('LC.B1. Complete the course which we have created in previous tests', () => {



  const courseName = Cypress.env('courseName');
  beforeEach(() => {
    cy.resetAppState();
    cy.logTestName.call(this);
    cy.login();
    cy.task("getUserEmail").then((data) => {
      // data — объект, берем поле email
      cy.login(data.email, Cypress.env('password'));
    });
  });

  it('Student should answer the lesson', function () {
    cy.login();
    cy.visit(ROUTES.studCourse);
    cy.wait(500);
    cy.task('logStep', 'Переход на страницу "Курсы" в юзерской части');
    // Find the course by name
    cy.xpath("//input[@id='search']").type(courseName);
    cy.wait(200);
    cy.task('logStep', 'Поиск нужного курса');

    cy.get('.focus-visible\\:ring-indigo')
      .invoke('attr', 'aria-expanded')
      .then(checked => {
        if (checked === 'false') {
          cy.get('.focus-visible\\:ring-indigo').click();
          cy.task('logInfo', 'Открытие группы курсов');
        }
        // Если 'true' — ничего не делаем
      });
    // Go to the course
    cy.xpath(`//h3[text()='${courseName}']`).click();
    cy.wait(200);
    cy.task('logInfo', 'Выбор курса');
    // Assert that we're in the course
    cy.xpath("//h1[text()='" + courseName + "']");
    cy.wait(200);
    // Start the course (click on run)
    cy.xpath("//button[@class='my-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500']")
      .click();
    cy.wait(800);

    //// FIRST LESSON ////
    // Assert we're in the second lesson
    cy.task('logInfo', 'Прохождение первого урока');
    cy.document().then(doc => {
      // Ищем элемент с точным текстом 'Lesson successfully completed!'
      const elements = [...doc.querySelectorAll('body *')];
      const found = elements.find(el => el.textContent.trim() === 'Lesson successfully completed!' && el.offsetParent !== null);

      if (found) {
        cy.task('logInfo', 'Урок завершен — переходим к следующему');
        cy.contains('QA Test lesson (text)').click();
      } else {
        cy.task('logInfo', 'Урок не завершен — отвечаем на вопросы');

        cy.xpath("//h1[text()='" + Cypress.env('lessonCheckboxRadio') + "']").should('exist');
        cy.wait(200);

        cy.xpath("(//input[@type='radio'])").parent().contains('answer 1').click();
        cy.xpath("//label[text()='answer 1']").click();
        cy.wait(200);

        cy.wait(2000);
        cy.xpath("//button[text()='Check']").click();
      }
    });

    //// SECOND LESSON ////
    // Assert we're in the third lesson
    cy.task('logInfo', 'Прохождение второго урока');
    cy.wait(500);
    cy.get('body').then($body => {
      if ($body.find('div:contains("The lesson is awaiting teacher review")').length > 0) {
        // Урок завершен — переходим к следующему
        cy.task('logInfo', 'Урок завершен — переходим к следующему');
        cy.contains('QA Test lesson (timer)').wait(500).click();
        cy.wait(1000);
      } else {
        // Урок не завершен — отвечаем на вопрос
        cy.task('logInfo', 'Урок не завершен — отвечаем на вопросы');

        cy.xpath("//h1[text()='" + Cypress.env('lessonText') + "']").should('exist');
        cy.wait(200);

        // Ввод ответа
        cy.xpath("//div[@contenteditable='true']").click().type("Lorem ipsum dolor sit amet, consectetur " +
          "adipisicing elit. Accusamus aspernatur dolorem dolorum eligendi esse facilis impedit ipsa maxime minus " +
          "molestiae nostrum odit provident quam ratione, sequi similique, tempore. Nemo, sunt?");

        // Отправка ответа
        cy.xpath("//button[text()='Check']").click();
        cy.wait(500);
      }




      //// THIRD LESSON ////
cy.task('logInfo', 'Прохождение третьего урока');

cy.get('div.lesson-wrapper').then($cont => {
  // Проверяем есть ли сообщение о завершении урока
  if ($cont.find('div:contains("The lesson is awaiting teacher review")').length > 0) {
    cy.task('logInfo', 'Урок завершён — переходим дальше');
  } else {
    cy.wrap($cont).contains('button', 'Start lesson', { timeout: 1000 })
      .then($btn => {
        // Кнопка найдена — запускаем урок
        cy.task('logInfo', 'Урок не начат — запускаем');
        cy.wrap($btn).click();
        cy.wait(1000);

        // Отвечаем
        cy.get('.ql-editor').eq(1).click().type("Lorem ipsum dolor sit amet, consectetur " +
          "adipisicing elit. Accusamus aspernatur dolorem dolorum eligendi esse facilis impedit ipsa maxime minus " +
          "molestiae nostrum odit provident quam ratione, sequi similique, tempore. Nemo, sunt?");
        cy.get('button').contains('Check').click();
        cy.wait(500);
      })
      .catch(() => {
        // Кнопка не найдена — урок уже начат
        cy.task('logInfo', 'Урок начат, но не завершён — отвечаем на вопрос');
        cy.get('.ql-editor').eq(1).click().type("Lorem ipsum dolor sit amet, consectetur " +
          "adipisicing elit. Accusamus aspernatur dolorem dolorum eligendi esse facilis impedit ipsa maxime minus " +
          "molestiae nostrum odit provident quam ratione, sequi similique, tempore. Nemo, sunt?");

        cy.get('button').contains('Check').click();
        cy.wait(500);
      });
  }




        //
        //// BACK TO THE FIRST LESSON
        cy.task('logInfo', 'Все уроки пройдены! Переход к первому уроку и ожидание проверки уроков.');
        cy.get('p').contains('QA Test lesson (checkbox + radio)').click();
        cy.wait(200);
        cy.get('div').contains('Lesson successfully completed!').should('be.visible')

      });
    })
  })

});
