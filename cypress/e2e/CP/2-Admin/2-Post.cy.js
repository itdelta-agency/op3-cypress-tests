
describe("CP2. Article List", () => {
  let articleName = Cypress.env('articleName');
  let categorisName = Cypress.env('categoryName')
  let answerNumber;
  let editCat = 'IT-Delta';
  let userName = 'Dashawn Durgan'



  beforeEach(() => {
    cy.admin();
  });


  it('should create Article', function () {

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


    cy.get('.mr-1').click();
    cy.get("button[role='switch']").eq(1).then($checkbox => {
      if (!$checkbox.attr('aria-checked') || $checkbox.attr('aria-checked') === 'false') {
        cy.wrap($checkbox).click();
      }
    });

    cy.wait(500);
    for (let i = 1; i < 4; i++) {
      cy.xpath("//span[text()='Add question']").click();
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
    cy.xpath("//button[text()='Save']").click();

    // cy.xpath("//span[text()='Confirmation']").parent().parent().next().contains('button', 'No').click();
    cy.wait(500);

    cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
  });

  it('edit articles', function () {
    cy.visit('cp/admin/post');
    cy.wait(500);
    cy.searchRow('Q');
    cy.wait(500);
    cy.xpath(`(//div[text()='${articleName}'])`).last().click();

    cy.contains('Edit article');

    cy.get('.shadow-sm').eq(0).clear().type(articleName);

    cy.get("button[role='switch']")
      .invoke('attr', 'aria-checked')
      .then(checked => {
        if (checked === 'false') {
          cy.get("button[role='switch']").click();
        }
      });

cy.get('.css-hlgwow')
  .then($el => {
    if ($el.length) {
      cy.wrap($el).click().type('123');
    } else {
      cy.get('.css-1dyz3mf').click().type('123');
    }
  })
  .then(() => {
    cy.contains('123', { timeout: 1000 }).click({ force: true });
  });
    // cy.xpath("//ul/li[6]/div[2]").click();
    // cy.wait(500);
    cy.contains('a', 'Questions 3').parent().next().find('span').eq(1).click();
    cy.wait(500);

    cy.get('.text-center.w-full').eq(2).click();
    cy.wait(1000);
    // cy.xpath("//span[text()='Confirmation']").parent().parent().next().contains('button', 'No').click();
    // cy.wait(500);

    cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
  })


  // after(() => {
  //   cy.clearCookies();
  // });
})

