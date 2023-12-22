const { recurse } = require('cypress-recurse')

describe("C. Invite user by 2 ways", () => {
    let userEmail;
    let userName;
    let main = Cypress.config('baseUrl').split('.')[1]
    let subject = 'Learning Center | Invitation to the Learning Center'
    let confirmationLink;

    before(() => {
        cy.task("getUserEmail").then((user) => {
            cy.log(user.email);
            cy.log(user.pass);
            userEmail = user.email;
            userName = user.email.replace("@ethereal.email", "");
        })
    })

    it('should invite by user menu', function () {
        cy.admin();

        // Go to invite user page
        cy.xpath("//button[@class='max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-50']").click();
        cy.xpath("//a[@href='" +Cypress.config('baseUrl') + "invite-user']").click();
        // Input credentials
        cy.xpath("//*[@id='email']").type(userEmail);


        // Click on submit button
        cy.xpath("//button[@type='submit']").click();
        cy.wait(3000);

        // Assert user invited
      cy.xpath("//p[text()='Success!']", { timeout: 10000 }).should('be.visible');
      cy.wait(2500);

    });

    it('getting last email', function () {
        cy.wait(3500);
        cy.log(main);
        recurse(
            () => {
                if(main === 'release') return  cy.task('getAccount', {subject, userEmail})
                if(main === 'org-online') return cy.task('getLastEmail', {});
            }, // Cypress commands to retry
            Cypress._.isObject, // keep retrying until the task returns an object
            {
                timeout: 60000, // retry up to 1 minute
                delay: 5000, // wait 5 seconds between attempts
            },
        )
        .its('html')
          .then((html) => {
            console.log(html);
            cy.document({ log: false }).invoke({ log: false }, 'write', html)
        })
        cy.xpath("//a[@class='button button-primary']").should('have.attr', 'href').then((href) => {
            confirmationLink = href;
        });
    });

    it('accept invitation', function () {
        cy.visit(confirmationLink);

        cy.xpath("//*[@id='first-name']").type('QA');
        cy.xpath("//*[@id='last-name']").type('Test')
        cy.xpath("//*[@id='password']").type(Cypress.env('password'), { log: false });
        cy.xpath("//*[@id='new_password']").type(Cypress.env('password'), { log: false });

        cy.xpath("(//button[@type='submit'])[1]").click();

        cy.xpath("//h2[text()='Learning center']").should('be.visible');
    });
});

