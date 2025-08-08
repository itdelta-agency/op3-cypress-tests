
describe("CP2. Article List", () => {
  let articleName = Cypress.env('articleName');
  let categorisName = Cypress.env('categoryName')
  let answerNumber;




  beforeEach(function () {
    cy.logTestName.call(this);
    cy.admin();
  });


  it('should create Article', function () {
    cy.task('logInfo', 'Переход на страницу "Статьи"');
    cy.get('.flex.justify-between', { timeout: 10000 }).eq(1).then($tab => {
      const isExpanded = $tab.attr('aria-expanded') === 'true';  // true если открыта
      if (!isExpanded) {
        cy.wrap($tab).click();
      }
    });
    cy.get('a.text-indigo-100',).eq(1).click();
    // cy.changeLang('en');
    cy.wait(1500);
    cy.get('.text-white.bg-indigo-600').eq(0).click();
    cy.task('logInfo', 'Переход на страницу создания статьи');
    cy.wait(1500);

    // create Article
    cy.get('.shadow-sm').eq(0).type(articleName);
    cy.get("button[role='switch']")
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").click();
        }
      });


    cy.get('.css-hlgwow').type(categorisName);
    cy.xpath("//*[text()='" + categorisName + "'][1]").click();
    cy.wait(1500);
    cy.whoCanSee(['Users', 'Teams', 'Others']);
    cy.wait(1500);

    cy.get('.px-3.py-1.text-sm').click();
    cy.task('logInfo', 'Создание ключевых слов');
    for (let i = 0; i <= 3; i++) {
      let word = 'QA Cours ' + i;
      cy.get('.flex-1.text-sm').click().type(word);
      cy.get('.px-3.py-1').eq(0).click();
      cy.get('.px-3.py-1.text-sm').click();
    }

    cy.get('.my-2.flex.flex-wrap').click();
    cy.get('.w-full.max-h-24')
      .children('li')
      .should('be.visible');

    cy.get('.mr-1').click();
    cy.get("button[role='switch']").eq(1).then($checkbox => {
      if (!$checkbox.attr('aria-checked') === 'false') {
        cy.wrap($checkbox).click();
      }
    });

    // Продолжение сценария:
    cy.get('.tab.flex.cursor-pointer').parent().next().find('span').eq(1).click();
    cy.wait(500);

    cy.wait(500);
    cy.task('logInfo', 'Создание вопросов');
    for (let i = 1; i < 4; i++) {
      cy.xpath("//span[text()='Add question']").click();
      cy.wait(300);                                       // Обход бага
      cy.get('div').contains('Text').click();             //
      cy.wait(300);                                       //
      cy.get('div').contains('Questions').click();        //
      cy.wait(300);                                       // После фикса удалить

      cy.xpath(`//ul/div/li/div[2]/div/ul/div[1]/li/div[1]/span[2]/a`).click();
      cy.xpath(`//ul/div/li/div[2]/div/ul/div[1]/li/div[1]/span[2]/input`).type(`Questions ${i}`);
      cy.xpath(`//ul/div/li/div[2]/div/ul/div[1]/li`).click();
      cy.xpath(`//ul/div/li/div[2]/div/ul/div[1]/li/div[2]/ul/div/li/div[1]/span[2]/a`).click();
      cy.xpath(`//ul/div/li/div[2]/div/ul/div[1]/li/div[2]/ul/div/li/div[1]/span[2]/input`)
        .type(`Answer 1`);
      cy.xpath(`//ul/div/li/div[2]/div/ul/div[1]/li`).click();
      answerNumber = 2;
      for (let j = 1; j < 3; j++) {
        cy.xpath(`//ul/div/li/div[2]/div/ul/div[1]/li/div[2]/div[last()]/span`).click();
        // cy.xpath(`//ul/li[last()]/div[last()]/div/ul/div[${i}]/li/div[2]/ul/div[last()]/li/div[1]/span[2]/a`)
        //   .click();
        cy.xpath(`//ul/div/li/div[2]/div/ul/div[1]/li/div[2]/ul/div[last()]/li/div[1]/span[2]/input`)
          .type(`Answer ${answerNumber}`);
        // cy.xpath(`//ul/li[last()]/div[last()]/div/ul/div[${i}]/li`).click();
        answerNumber++;
      }
      cy.xpath(`//ul/div/li/div[2]/div/ul/div[1]/li/div[2]/ul/div[${i}]/li/div[2]/div/div`).click();
    }
    cy.xpath("//button[text()='Save & Close']").click();

    cy.checkTextInParagraph();

  });

  it('edit articles', function () {
    cy.visit('cp/admin/post');
    
    cy.wait(500);
    cy.searchRow('Q');
    cy.wait(500);
    cy.xpath(`(//div[text()='${articleName}'])`).last().click();

    cy.contains('Edit article');

    cy.get('.shadow-sm').eq(0).clear().type(articleName);
    cy.task('logInfo', 'Переход на страницу "Редактирование статьи"');
    cy.get("button[role='switch']")
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").click();
        }
      });

    cy.contains('div', categorisName).parent()
      .find('svg').click();
    cy.get('.css-hlgwow').type(categorisName);
    cy.xpath("//*[text()='" + categorisName + "'][1]").click();
    cy.wait(1500);

    // Продолжение сценария:
    cy.get('.tab.flex.cursor-pointer').parent().next().find('span').eq(1).click();
    cy.wait(500);

    cy.get('.text-center.w-full').eq(2).click();
    cy.checkTextInParagraph();

    cy.wait(1500);
    cy.bulkAction(['Activate', 'Deactivate'], [articleName]);

  })

});