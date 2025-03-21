
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
    cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Regulations")').click({multiple: true});
    cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Articles")').click({multiple: true});
    // cy.changeLang('en');
    cy.wait(5000);
    cy.contains('Add article').click();
    cy.wait(500);

    // create Article
    cy.get('ul li:first input').type(articleName);


    cy.xpath('//span[text()="Categories *"]//following-sibling::span/descendant::input').type(categorisName);
    cy.xpath("//*[text()='" + categorisName + "'][1]").click();


    cy.xpath("//ul/li[6]/div[2]").click();
    cy.xpath("//ul/li[7]/span[2]").click();
    cy.wait(500);
    for (let i = 1; i < 4; i++) {
      cy.xpath("//span[text()='Add question']").click();
      cy.xpath(`//ul/li[8]/div[last()]/div/ul/div[1]/li/div[1]/span[2]/a`).click();
      cy.xpath(`//ul/li[8]/div[last()]/div/ul/div[1]/li/div[1]/span[2]/input`).type(`Questions ${i}`);
      cy.xpath(`//ul/li[8]/div[last()]/div/ul/div[1]/li`).click();
      cy.xpath(`//ul/li[8]/div[last()]/div/ul/div[1]/li/div[2]/ul/div/li/div[1]/span[2]/a`).click();
      cy.xpath(`//ul/li[8]/div[last()]/div/ul/div[1]/li/div[2]/ul/div/li/div[1]/span[2]/input`)
        .type(`Answer 1`);
      cy.xpath(`//ul/li[8]/div[last()]/div/ul/div[1]/li`).click();
      answerNumber = 2;
      for (let j = 1; j < 3; j++) {
        cy.xpath(`//ul/li[8]/div[last()]/div/ul/div[1]/li/div[2]/div[last()]/span`).click();
        // cy.xpath(`//ul/li[last()]/div[last()]/div/ul/div[${i}]/li/div[2]/ul/div[last()]/li/div[1]/span[2]/a`)
        //   .click();
        cy.xpath(`//ul/li[8]/div[last()]/div/ul/div[1]/li/div[2]/ul/div[last()]/li/div[1]/span[2]/input`)
          .type(`Answer ${answerNumber}`);
        // cy.xpath(`//ul/li[last()]/div[last()]/div/ul/div[${i}]/li`).click();
        answerNumber++;
      }
      cy.xpath(`//ul/li[8]/div[last()]/div/ul/div[1]/li/div[2]/ul/div[${i}]/li/div[2]/div/div`).click();
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

    cy.xpath('//span[text()="Categories *"]//following-sibling::span/descendant::input').type(' ');
    cy.wait(500);

    cy.xpath("//ul/li[6]/div[2]").click();
    cy.xpath("//ul/li[7]/span[2]").click();
    cy.wait(500);
    cy.contains('a', 'Questions 3').parent().next().find('span').eq(1).click();
    cy.wait(500);

    cy.xpath("//button[text()='Save']").click();
    cy.wait(1000);
    // cy.xpath("//span[text()='Confirmation']").parent().parent().next().contains('button', 'No').click();
    // cy.wait(500);

    cy.xpath("//p[text()='Success!']", {timeout: 5000}).should('be.visible');
  })


  // after(() => {
  //   cy.clearCookies();
  // });
})
