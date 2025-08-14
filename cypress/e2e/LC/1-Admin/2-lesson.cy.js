import { ROUTES } from "../../../support/routes";

describe("LC.A1. Create lessons", () => {
  let lName = Cypress.env('lessonCheckboxRadio');
  let qNameR = Cypress.env('questionRadio');
  let qNameCB = Cypress.env('questionCheckbox');
  let lessonText = Cypress.env('lessonText');
  let lessonTimer = Cypress.env('lessonTimer');
  let qName = Cypress.env('questionText');

  beforeEach(function () {
    cy.logTestName.call(this);
    cy.admin();
  });

  it('should create lesson(checkbox + radio)', function () {
    cy.task('logStep', 'Переход на страницу создания курса, для создания уроков');
    // Go to add courses page
    cy.get('.flex.justify-between', { timeout: 10000 }).eq(2).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
      }
    });
    cy.contains('Courses').click();

    cy.wait(500);
    cy.accessAllItems();
    cy.xpath("(//div[text()='" + Cypress.env('courseName') + "'])[1]").click();

    cy.xpath("//span[text()='List of lessons']//following-sibling::span/descendant::input").click();
    cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[7]/span[2]/div[3]/div[2]/div/div[2]/button").click();

    cy.wait(500);
    // CREATE LESSON
    cy.task('logStep', 'Создание первого урока ');
    cy.xpath("//h2[text()='Create lesson']").click();
    cy.xpath("//input[@type='text']").first().type(lName);
    cy.xpath("//button[@role='switch']").click();


    // CREATE QUESTION AND ANSWER RADIO
    cy.xpath("//span[text()='Add question']").click();
    cy.wait(500);

    cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/button[1]").click();
    cy.wait(500);
    // cy.contains(lName).click();
    cy.wait(500);
    cy.question(qNameR, 2);
    cy.wait(500);
    // CREATE QUESTION AND ANSWER checkbox
    cy.xpath("//span[text()='Add question']").click();
    cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/button[1]").click();
    cy.wait(500);
    cy.question(qNameCB, 3);
    //
    // // SAVE LESSON
    cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/div/button[2]").click();
    cy.checkTextInParagraph();
    cy.task('logInfo', 'Первый урок создан!');


  });


  it('should create lesson(text)', function () {

  
    cy.visit(ROUTES.courses);
    cy.wait(500);
    cy.accessAllItems();
    cy.xpath("(//div[text()='" + Cypress.env('courseName') + "'])[1]").click();

    cy.xpath("//span[text()='List of lessons']//following-sibling::span/descendant::input").click();
    cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[7]/span[2]/div[3]/div[2]/div/div[2]/button").click();

    //// Create lesson ////
    cy.task('logStep', 'Создание второго урока');
    cy.xpath("//h2[text()='Create lesson']").click();
    cy.xpath("//input[@type='text']").first().type(lessonText);
    cy.xpath("//button[@role='switch']").click();
    cy.xpath("//span[text()='Add question']").click();
    cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/button[1]").click();
    cy.question(qName, 1);
    cy.xpath("//button[text()='Save']").click();
    cy.checkTextInParagraph();
    cy.task('logInfo', 'Второй урок создан');

  });



  it('should create lesson(timer)', function () {
    const q2Name = Cypress.env('questionText');

  
    cy.visit(ROUTES.courses);

    // cy.xpath("//a[text()='Courses']").click();
    cy.wait(500);
    cy.accessAllItems();
    cy.xpath("(//div[text()='" + Cypress.env('courseName') + "'])[1]").click();

    cy.xpath("//span[text()='List of lessons']//following-sibling::span/descendant::input").click();
    cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[7]/span[2]/div[3]/div[2]/div/div[2]/button").click();

    // Create lesson
    cy.task('logStep', 'Создание третьего урока ');
    cy.xpath("//h2[text()='Create lesson']").click();
    cy.xpath("//input[@type='text']").first().type(lessonTimer);
    cy.xpath("//button[@role='switch']").click();
    cy.get('input[type="text"]').eq(2).type(2);

    // Create text question
    cy.task('logInfo', 'Создание вопросов к уроку');
    cy.xpath("//span[text()='Add question']").click();
    cy.wait(200);
    cy.get('.flex.flex-row-reverse').contains('Save').click();
    cy.wait(700);
    cy.get('input.shadow-sm').eq(0).click().type(q2Name);
    cy.wait(200);
    cy.get('input.shadow-sm').eq(1).type(qName + 2);
    cy.get("button[role='switch']")
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").eq(0).click();
        }
      });
    // cy.question(qName, 1);
    cy.contains('button[type="button"]', 'Save').click();
    cy.wait(1500);
    cy.task('logInfo', 'Вопросы созданы!');

    cy.xpath("//button[text()='Save']").click();
    cy.checkTextInParagraph();
    cy.task('logInfo', 'Третий урок создан!');
  });



  it('check bulk action', function() {
    cy.task('logStep', 'Переход на страницу уроков, для проверки массовых действий');

    cy.visit(ROUTES.lessons)
    cy.wait(2000);
    //Проверка массовых действий
    cy.bulkAction(['Deactivate', 'Activate',], [lName, lessonText, lessonTimer]);
    
  })


  it('save Lesson of Course', function () {
    cy.task('logStep', 'Переход на страницу "Курсы"');
    const courseName = Cypress.env('courseName');

    // cy.login();
    cy.visit(ROUTES.courses);
    cy.wait(1100);
    cy.accessAllItems();

    // Открыть нужный курс
    cy.xpath(`(//div[text()='${courseName}'])`).first().click();
    cy.wait(500);
    cy.scrollTo('bottom', { ensureScrollable: false });
    cy.wait(500);

    

    cy.get('.list-reset.flex ').within(() => {
      cy.contains(lName).scrollIntoView().should('be.visible');
      cy.contains(lessonText).should('be.visible');
      cy.contains(lessonTimer).should('be.visible');
    });
    cy.task('logInfo', 'Созданные уроки отображаются в курсе');

    cy.contains(lName).should('be.visible');

    cy.get("button[role='switch']").eq(1)
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").eq(1).click();
        }
      });


    // Сохранить курс
    
    cy.xpath("//button[text()='Save']").click();
    cy.checkTextInParagraph();
  });

});
