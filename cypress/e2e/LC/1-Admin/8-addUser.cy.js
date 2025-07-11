import {ROUTES} from '../../support/routes';


describe("US.1 Add User", () => {

    let email;
    let password;

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.admin();
        email = Cypress.env('QA_TEST_LOGIN');
        password = Cypress.env('QA_TEST_PASSWORD');
    });

    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.logout(); 
    });



    it('Add user', function () {
        
        cy.changeLang('ru');
        cy.visit(ROUTES.createUser); 
   
        cy.get('.bg-indigo-800', { timeout: 10000 }).should('be.visible').click();

        cy.log("Нажал кнопку  \"Создать пользователя\"");
        // Клик по кнопке "Создать пользователя"
        cy.get('.text-white.bg-indigo-600').eq(1).should('be.visible').click();

        cy.xpath("//span[text()='Имя *']").should('be.visible').next().type('QA');
        cy.xpath("//span[text()='Фамилия']").should('be.visible').next().type('USER');
        cy.xpath("//span[text()='Почта *']").should('be.visible').next().type(email);
        cy.xpath("//span[text()='Телефон']").should('be.visible').next().type('+7 999 999 99 99');
        cy.xpath("//span[text()='Пароль *']").should('be.visible').next().type(password);
        cy.xpath("//span[text()='Повторите пароль *']").should('be.visible').next().type(password);

        cy.get('button[id="headlessui-switch-:r4o:"]').should('be.visible').click();

        // Загрузка файла 
        cy.xpath('//input[@id="avatar"]').should('exist').selectFile('cypress/image/qaUser.jpg', { force: true });

        cy.xpath("//button[text()='Выбрать']").should('be.visible').click();
        cy.xpath("(//div[text()='Команды'])").should('be.visible').click();
        cy.contains("Выбрать: Команды").parent().next().should('be.visible').click();
        cy.xpath("/html/body/div[3]/div/div/div/div/div[2]/div[2]/div/div[1]/div[2]/input")
          .should('be.visible').type('Qa');
        cy.xpath("//div[text()='Qa Test Team']").scrollIntoView().should('be.visible').click();
        cy.contains("Выбрать: Команды").parent().next().next().next().should('be.visible').click();

        // Сохраняем пользователя
        cy.xpath("//button[text()='Сохранить']").should('be.visible').click();

        // Проверяем уведомление об успешном создании
        cy.contains('Пользователь успешно создан!').should('be.visible');
    });

    it('check add User', () => {
        cy.visit(ROUTES.users);
        cy.changeLang('en');

        // Ожидаем, пока элемент с текстом 'Users' появится и кликаем
        cy.get('a.bg-indigo-800').click();

        cy.accessAllItems();
        cy.contains('div', email).should('be.visible').click();
    });

    it('edite User', () => {

        cy.visit(ROUTES.users);
        cy.changeLang();

        cy.get('a.bg-indigo-800').click();

        cy.accessAllItems();

        // Убедись, что email определён (возможно его нужно глобально хранить)
        cy.contains(email).should('be.visible')
          .parent().parent().last().find('div').eq(2).should('be.visible').click();


        // Ждём видимости полей и очищаем + вводим новые данные
        cy.xpath("//span[text()='Имя *']").should('be.visible').next().clear().type('QA QA');
        cy.xpath("//span[text()='Фамилия']").should('be.visible').next().clear().type('USER USER');

        email = 'Edit' + email;
        password += ' Edit';

        cy.xpath("//span[text()='Почта *']").should('be.visible').next().clear().type(email);
        cy.xpath("//span[text()='Телефон']").should('be.visible').next().clear().type('+7 999 999 99 99');
        cy.xpath("//span[text()='Пароль *']").should('be.visible').next().clear().type(password);
        cy.xpath("//span[text()='Повторите пароль *']").should('be.visible').next().clear().type(password);

        cy.xpath('//input[@id="avatar"]').should('exist').selectFile('cypress/image/editQaUser.jpg', { force: true });
        cy.xpath("//span[text()='Администратор']").should('be.visible').next().children().click();

        cy.xpath("//button[text()='Сохранить']").should('be.visible').click();

        cy.contains('Пользователь успешно обновлён!').should('be.visible');
    });

    it('check user team/departments', () => {
        cy.login();
        cy.visit('/admin/teams');
        cy.changeLang('en');

        cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']")
          .find(':contains("Users")').should('be.visible').click({ multiple: true });

        // Навигация по командам с ожиданием элементов
        cy.visit("admin/teams");
        cy.accessAllItems();

        cy.xpath("//div[text()='Qa Test Team']").should('be.visible').click();

        // Проверка, что пользователь есть в команде
        cy.xpath("//span[text()='Users']").next().contains('QA QA USER USER').should('be.visible');
    });

    it("log in account", () => {
        cy.login(email, password);
        cy.visit('lc/admin/courses');
    });
});