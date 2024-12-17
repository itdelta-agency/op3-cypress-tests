describe("CP3. Article List", () => {

  let articleName = Cypress.env('articleName');
  const userNames = Cypress.env('usersArticle');

  beforeEach(() => {
    cy.login();
  });

  it('Deactivate Article', function () {
    cy.visit('cp/admin/post');
    cy.wait(500);
    cy.searchRow(articleName);
    cy.xpath(`//div[text()="${articleName}"]`).click();
    cy.wait(500);
    cy.xpath('//span[text()="Active"]/../span[2]/button').click();
    cy.wait(500);
    cy.xpath('//button[text()="Save"]').click();
    // cy.xpath("//span[text()='Confirmation']").parent().parent().next().contains('button', 'No').click();
    cy.wait(500);
    cy.xpath("//p[text()='Success!']", {timeout: 5000}).should('be.visible');
  });
  //
  it('Check deactive article', function () {
    cy.searchReport(userNames);
    cy.wait(1000);
    cy.xpath(`//div[text()='${userNames}']`).next().should(($el) => {
      if(!$el[0].childElementCount) {
        expect(!$el[0].childElementCount).to.be.true
      }
    }).then((el) => {
      if(el[0].childElementCount) {
       cy.xpath(`//div[text()='${userNames}']`).next().type(articleName);
        cy.wait(200);
        cy.xpath(`//div[text()='${userNames}']`).next().find('div').last().contains(articleName).should('not.exist');
      }
    })
    //cy.contains(userNames).parent().find('div').contains(articleName).should('not.exist');
   // cy.contains(userNames).parent().parent().next().contains(articleName, { timeout: 5000 }).should('not.exist');
    cy.wait(500)
  })
  //
  it('Activate Article', function () {
    cy.visit('cp/admin/post');
    cy.wait(500);
    cy.searchRow(articleName);
    cy.xpath(`//div[text()="${articleName}"]`).click();
    cy.wait(500);
    cy.xpath('//span[text()="Active"]/../span[2]/button').click();
    cy.wait(500);
    cy.xpath('//button[text()="Save"]').click();
    // cy.wait(500);
    // cy.xpath("//span[text()='Confirmation']").parent().parent().next().contains('button', 'No').click();
    cy.wait(500);
    cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
  })

  it('checkActive Article', function () {
    cy.searchReport(userNames);

    cy.wait(1000);
    cy.xpath(`//div[text()='${userNames}']`).next().scrollIntoView().click().type(articleName).contains('div', articleName).should('be.visible');;
    cy.wait(500);
  })

})