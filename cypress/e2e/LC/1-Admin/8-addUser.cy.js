describe("US.1 Add User", () => {

    let email = `qaUserManual${Math.random()}@mail.ru`;
    let password = `Qa${Math.random()}`

    before(() => {
        cy.admin();
    })


    it('Add user', function () {
        // Go to add user page
        cy.changeLang();
        cy.wait(2000);
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Пользователи")').click({multiple: true});
        cy.xpath("//button[text()='Добавить пользователя']").click();

        cy.wait(1000);

        // filling in the fields
        cy.xpath("//span[text()='Имя *']").next().type('QA');
        cy.xpath("//span[text()='Фамилия']").next().type('USER')
        cy.xpath("//span[text()='Почта *']").next().type(email);
        cy.xpath("//span[text()='Телефон']").next().type('+7 999 999 99 99');
        cy.xpath("//span[text()='Пароль *']").next().type(password);
        cy.xpath("//span[text()='Повторите пароль *']").next().type(password);
        cy.xpath("//span[text()='Статус']").next().children().click();

        // Add IMAGE
        cy.xpath('//input[@id="avatar"]').selectFile('cypress/image/qaUser.jpg', {force: true});


        // departments
        // cy.xpath("//button[text()='Выбрать']").click();
        // cy.wait(500);
        // cy.contains("Выбрать: Отделы").parent().next().click();
        // cy.wait(500);
        // cy.xpath("//div[text()='Marketing']").click();
        // cy.contains("Выбрать: Отделы").parent().next().next().next().click();
        // cy.wait(500);

        //Team
        cy.xpath("//button[text()='Выбрать']").click();
        cy.wait(500);
        cy.xpath("(//div[text()='Команды'])").click();
        cy.wait(500);
        cy.contains("Выбрать: Команды").parent().next().click();
        cy.wait(500);
        cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/div/div[1]/div[2]/input").type('Qa');
        cy.xpath("//div[text()='Qa Test Team']").scrollIntoView().click();
        cy.wait(500);
        cy.contains("Выбрать: Команды").parent().next().next().next().click();

        cy.wait(500);
        //Save
        cy.xpath("//button[text()='Сохранить']").click();
        cy.wait(500);
        cy.contains('Пользователь успешно создан!').should('be.visible');
    })

    it('check add User', () => {
        cy.login()
        cy.visit('/admin/teams')
        cy.changeLang('en');
        cy.wait(2000);
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Users")').click({multiple: true});
        cy.wait(500);
        cy.accessAllItems();
        cy.contains('div', email).click()
    })

    it('edite User', () => {
        cy.login()
        cy.visit('/admin/teams')
        cy.changeLang('en');
        cy.wait(2000);
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Users")').click({multiple: true});
        cy.wait(500);
        cy.accessAllItems();
        cy.wait(500);
        cy.contains(email).parent().parent().last().find('div').eq(2).click();
        cy.wait(1500);

        cy.changeLang();
        cy.wait(1500);
        // filling in the fields
        cy.xpath("//span[text()='Имя *']").next().clear().type('QA QA');
        cy.xpath("//span[text()='Фамилия']").next().clear().type('USER USER');

        email = 'Edit' + email;
        password+=' Edit';

        cy.xpath("//span[text()='Почта *']").next().clear().type(email);
        cy.xpath("//span[text()='Телефон']").next().clear().type('+7 999 999 99 99');
        cy.xpath("//span[text()='Пароль *']").next().clear().type(password);
        cy.xpath("//span[text()='Повторите пароль *']").next().clear().type(password);
        cy.xpath('//input[@id="avatar"]').selectFile('cypress/image/editQaUser.jpg', {force: true});
        cy.xpath("//span[text()='Администратор']").next().children().click();

        //Save
        cy.xpath("//button[text()='Сохранить']").click();
        cy.wait(2000);
        cy.contains('Пользователь успешно обновлён!').should('be.visible');
    })

    it('check user team/departments', () => {
        cy.login()
        cy.visit('/admin/teams')
        cy.changeLang('en');
        cy.wait(2000);
        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Users")').click({multiple: true});
        cy.wait(500);
        // cy.xpath("//a[text()='Отделы']").click();
        // cy.wait(1000);
        // cy.xpath("//div[text()='Marketing']").click();
        // cy.wait(500);

        // check User
//        cy.xpath("//span[text()='Пользователи']").next().contains('QA QA USER USER').should('be.visible');


        //check Team
        cy.visit("admin/teams");
        cy.wait(1500);
        cy.accessAllItems();
        cy.xpath("//div[text()='Qa Test Team']").click();
        cy.wait(500);

        cy.xpath("//span[text()='Users']").next().contains('QA QA USER USER').should('be.visible');
    })

    it("log in account", () => {
        cy.login(email, password);
        cy.wait(1500);
        cy.visit('lc/admin/courses');
    })
})
