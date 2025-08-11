import { ROUTES } from "../../../support/routes";

describe("LC.A5. Create team", () => {
    let teamName = Cypress.env('teamName');

    const addName = 'sd'
    let userProfile = 'QA Edit USER';

    beforeEach(function () {
        cy.logTestName.call(this);
        cy.wait(500);
        cy.admin();
        // cy.changeLang('en');
    });

    it('should create new team', function () {
        cy.task('logInfo', 'Переход на страницу "Команды"');
        // Go to add user page
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Teams")').click({ multiple: true });
        cy.wait(500);
        cy.xpath("//button[text()='Add team']").click();
        cy.task('logInfo', 'Переход на страницу "Создание команды"');

        // Input credentials
        cy.xpath("//span[text()='Name *']").next().type(teamName + addName);
        cy.xpath("//textarea").type("Lorem ipsum dolor sit amet, consectetur adipisicing elit.");

        cy.xpath("//button[text()='Save']").click();

        cy.checkTextInParagraph();
        cy.task('logInfo', 'Команда создана!');
    });

    it('should edit team', function () {
        cy.visit(ROUTES.teams);
        cy.task('logInfo', 'Переход на страницу "Команды"');


        cy.wait(1000);
        cy.accessAllItems();
        cy.xpath(`(//div[text()='${teamName + addName}'])`).last().click();

        cy.contains('Edit team').click();

        cy.xpath("//span[text()='Name *']").next().clear().type(teamName);
        cy.wait(500);


        cy.get('.css-19bb58m').should('exist')
            .type('QA Edit', { delay: 50 });
        cy.get('div[class*="menu"] div')
            .contains(userProfile)
            .click({ force: true });

        cy.xpath("//button[text()='Save']").should('be.visible').click();
        cy.checkTextInParagraph();
        cy.task('logInfo', 'Команда отредактированна');
    })


    it('check add User Team', function () {
        cy.admin();
        cy.task('logInfo', 'Переход на страницу "Пользователи" для выбора пользователя');


        cy.visit(ROUTES.users);

        cy.searchRow('QA Edit');

        cy.contains('tr[role="row"]', 'QA Edit USER')
            .within(() => {
                // 2. Клик по бургер-иконке
                cy.get('button').first().click();
            });
        
        cy.task('logInfo', 'Пользователь выбран!');    
        // 3. Дождаться и кликнуть по первому пункту выпадающего меню
        cy.get('div.flex.cursor-pointer') // это каждый пункт меню
            .first()
            .should('be.visible')
            .click();
        cy.task('logInfo', 'Переход в профиль пользователя');
        cy.get('.ml-3.relative').eq(0).click();
        cy.wait(500);
        cy.get('a').contains('Profile').click();

        cy.wait(1500);
        cy.xpath("//label[text()='Teams']").parent().contains('Qa Test Team').should('be.visible');
        cy.task('logInfo', 'Созданная команда отображается у пользователя в профиле!');
    })

});