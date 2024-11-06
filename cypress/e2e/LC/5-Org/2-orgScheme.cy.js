describe('OrgBoard.A2. Create department', () => {
    const department = 'QA department';
    let userEmail
    before(() => {
        cy.task("getUserEmail").then((user) => {
            cy.log(user.email);
            cy.log(user.pass);
            userEmail = user.email;
        })
    });

    beforeEach(() => {
        cy.admin();
        cy.visit('ob/admin/departments/scheme');
        cy.wait(3000);
    });

    // it('should create position', function () {
    //     cy.xpath('//a[@class="flex justify-end cursor-pointer"]').click();
    //     cy.wait(3000);
    //
    //     cy.xpath("//span[text()='Name *']").next().type(department);
    //     cy.xpath("//span[text()='Head']").next().children().click();
    //     cy.xpath("//span[text()='Head']").next().children().type('QA position');
    //     cy.xpath("//div[text()='QA position: Qa User']").scrollIntoView().click();
    //
    //
    //     cy.xpath("//button[text()='Save']").click();
    //     cy.wait(500);
    //     cy.contains("Success").should('be.visible');
    // })

    it('should create sub position', function () {

        cy.xpath(`//div[text()='${department}']`).scrollIntoView().click();
        cy.xpath("//div[@class='gap-x-1 z-10 flex opacity-100 flex opacity-0 group-hover:flex group-hover:opacity-100 transition-[5s]']").click();
        // cy.xpath('//a[@class="flex justify-end cursor-pointer"]').click();
        // cy.wait(3000);
        //
        cy.xpath("//span[text()='Name *']").next().type(department + '2');


        // cy.xpath("//button[text()='Save']").click();
        // cy.wait(500);
        // cy.contains("Success").should('be.visible');
    })
})