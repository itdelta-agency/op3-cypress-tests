describe("CP3. Article List", () => {

  let articleName = Cypress.env('articleName');
  const userNames = Cypress.env('usersArticle');

  beforeEach(() => {
    cy.login();
  });

  it('Deactivate Article', function () {
    cy.visit('admin/cp/post');
    cy.wait(500);
    cy.xpath(`//div[text()="${articleName}"]/../../../../../th[3]/div/div[2]`).click();
    cy.wait(500);
    cy.xpath('//span[text()="Active"]/../span[2]/button').click();
    cy.wait(500);
    cy.xpath('//button[text()="Save"]').click();
    cy.xpath("//p[text()='Success!']", {timeout: 5000}).should('be.visible');
  });

  it('Check deactive article', function () {
    cy.visit('admin/cp/report');
    cy.xpath('//button[text()="Show results"]').click();

    cy.wait(3500);
    cy.xpath(`//div[text()='${userNames}']`).next().should(($el) => {
      if(!$el[0].childElementCount) {
        expect(!$el[0].childElementCount).to.be.true
      }
    }).then((el) => {
      if(el[0].childElementCount) {
        cy.xpath(`//div[text()='${userNames}']`).next().click().contains(articleName).should('not.exist');
      }
    })
    //cy.contains(userNames).parent().find('div').contains(articleName).should('not.exist');
   // cy.contains(userNames).parent().parent().next().contains(articleName, { timeout: 5000 }).should('not.exist');
    cy.wait(500)
  })

  it('Activate Article', function () {
    cy.visit('admin/cp/post');
    cy.wait(500);
    cy.xpath(`//div[text()="${articleName}"]/../../../../../th[3]/div/div[2]`).click();
    cy.wait(500);
    cy.xpath('//span[text()="Active"]/../span[2]/button').click();
    cy.wait(500);
    cy.xpath('//button[text()="Save"]').click();
    cy.wait(500);
    cy.xpath("//p[text()='Success!']", { timeout: 5000 }).should('be.visible');
  })

  it('checkActive Article', function () {
    cy.visit('admin/cp/report');
    cy.wait(500);
    cy.xpath('//button[text()="Show results"]').click();

    cy.wait(3500);

    cy.xpath(`//div[text()='${userNames}']`).next().scrollIntoView().click().contains('div', articleName).should('be.visible');
    cy.wait(500);
  })

})