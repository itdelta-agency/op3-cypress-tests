Cypress.Commands.add('login', (username = Cypress.env('email'), password = Cypress.env('password')) => {
    const hashCode = function (str) {
        str = "" + str;
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    cy.session([username, hashCode(password)], () => {
        cy.visit(Cypress.config('baseUrl') + 'login', { timeout: 10000 });

        cy.xpath("//input[@id='email']", { timeout: 10000 }).type(username);
        cy.xpath("//input[@id='password']", { timeout: 10000 }).type(password, { log: false });

        cy.xpath("//button[@type='submit']", { timeout: 10000}).click();
        cy.wait(4000);
        cy.window().its('localStorage').invoke(`setItem`, 'tableFilterExpanded_/cp/admin/post', 'false')
        cy.window().its('localStorage').invoke(`setItem`, 'tableFilterExpanded_/st/admin/index', 'false')
    });

});

Cypress.Commands.add('admin', () => {
    cy.login();
    cy.visit('/')
    cy.visitAdmin();
    cy.wait(3000);
    cy.get('body').then(($body) => {
        if($body.find('.inline-block.align-bottom.bg-white button').length) {
            return '.inline-block.align-bottom.bg-white button';
        }

        return 'body';
    })
    .then(selector => {
        cy.get(selector).click();
    })

    cy.wait(500);
});

Cypress.Commands.add('createAnswerForQuestion', (questionName) => {
  cy.wait(1500);
  cy.xpath("//span[text()='Add answer']").click();
  cy.wait(500);
  /* cy.xpath("(//div[text()='" + lName + "'])[1]") */
  // cy.xpath("(//button[text()='Save'])[2]").click();

  //  // cy.xpath("//*[text()='Create answer']").should('be.visible');
  cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[6]/div[2]/div/div[1]/button").click();
  cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[6]/div[2]/div/div[2]/input").type(questionName + ' answer');
  cy.xpath("(//button[@role='switch'])[2]").click();
  cy.xpath("(//button[text()='Save'])[1]").click();
  // cy.xpath("//p[text()='Success!']").should('be.visible');
});

Cypress.Commands.add('addAnswers', () => {

  cy.xpath("//span[text()='Add answer']").click();

  // cy.xpath("//input[@type='text']").type(Cypress.env('answer1'));
  // cy.xpath("(//button[@role='switch'])[1]").click();
  // cy.xpath("(//button[@role='switch'])[2]").click();
  // cy.xpath("//button[text()='Save']").click();


  cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[5]/div[2]/div/div[1]/input").type(Cypress.env('answer1'));
    cy.xpath("//input[@type='checkbox']").click();
    cy.xpath("(//button[@role='switch'])[2]").click();
    cy.xpath("(//button[text()='Save'])[1]").click();

  cy.xpath("//span[text()='Add answer']").click();
  cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[5]/div[2]/div/div[1]/input").type(Cypress.env('answer2'));
  cy.xpath("//input[@type='checkbox']").click();
  cy.xpath("(//button[text()='Save'])[1]").click();

  cy.xpath("//span[text()='Add answer']").click();
  cy.xpath("/html/body/div[2]/div/div/div[2]/div[2]/main/div/ul/li[5]/div[2]/div/div[1]/input").type(Cypress.env('answer3'));
  cy.xpath("//input[@type='checkbox']").click();
  cy.xpath("(//button[text()='Save'])[1]").click();

});

Cypress.Commands.add('question', (questionName, questionType) => {

   // cy.xpath("//div[@class='flex items-center cursor-pointer mb-3']").click();
    cy.xpath("//h2[text()='Add question']").click();

   // // cy.xpath("//*[text()=Создание вопроса']").should('be.visible');
    cy.xpath("(//input[@type='text'])[1]").type(questionName);
    cy.xpath("(//input[@type='text'])[2]").type(questionName + questionType);

    cy.xpath("(//div[@role='radio'])[" + questionType + "]").click({ force: true });
    cy.xpath("(//div[@role='radio'])[" + questionType + "]").click({ force: true });

    questionType === 1 && cy.xpath("//button[@role='switch']").click();
    if(questionType !== 1) {
        cy.addAnswers();
        cy.xpath("//button[@role='switch']").click();
    }
    // cy.xpath("//input[@type='number']").type(10);
    cy.xpath("//button[text()='Save']").click();
    cy.wait(1500);
    cy.contains("Success").should('be.visible');
});

Cypress.Commands.add('closePopup', () => {
    const isNonExistentOrHidden  = ($el => Cypress.dom.isElement($el));

    cy.wait(1000);
    cy.contains("span", "Attention!").should(($el) => {
        if(!isNonExistentOrHidden($el)) {
            expect(isNonExistentOrHidden($el)).to.be.false
        }

    }).then((res) => {
        if(res.length) {
            cy.contains("span", "Attention!").parent().parent().next().find('button').click();
            cy.wait(500);
        }
    })
    cy.wait(1000)
});

Cypress.Commands.add('accessAllItems', () => {
    cy.wait(2000);
    // cy.xpath('(//button/span[starts-with(text(), \'Show\')])[last()]').click();
    cy.get('[data-test-id="pageCountButton"]').scrollIntoView().click();
    cy.wait(1000);
    cy.xpath("//li/span[text()='Show 100 elements']").click()
    cy.wait(1000);
});

Cypress.Commands.add('changeLang', (lang='ru') => {
    cy.get('[data-header-test-id="lang_button"]').click();
    cy.wait(500);
    cy.get(`[data-header-test-id=${lang}]`).click();
    cy.wait(500);
});

Cypress.Commands.add('changeLangAuth', () => {
    cy.xpath("/html/body/div[2]/div/nav/div/div/div[2]/div/div/button").click();
    cy.wait(500);
    cy.xpath("/html/body/div[2]/div/nav/div/div/div[2]/div/div").find('a').last().click();
    cy.wait(500);
})

Cypress.Commands.add('logout', () => {
    cy.wait(1500);
  cy.xpath("//button[@class='max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-50]'").click();
  cy.wait(500);
    cy.xpath("//a[@href='" +Cypress.config('baseUrl') + "logout']").click();
    cy.wait(1500);
});

Cypress.Commands.add('searchRow', (name) => {
    cy.xpath("//div[@class='tooltip']").click();
    cy.wait(500);
    cy.xpath("//span[text()='Name']").parent().parent().parent().find('[placeholder="Search"]').type(name)
    // cy.get('[placeholder="Search"]').type(name);
    cy.wait(500);
    cy.xpath("//span[text()='Name']").parent().parent().parent().find('[placeholder="Search"]').type(' ')
    cy.wait(1000);
})

Cypress.Commands.add('skipTests', (cookieName) => {
    if ( Cypress.browser.isHeaded ) {
        cy.clearCookie(cookieName)
    } else {
        cy.getCookie(cookieName).then(cookie => {
            if (
                cookie &&
                typeof cookie === 'object' &&
                cookie.value === 'true'
            ) {
                Cypress.runner.stop();
            }
        });
    }
});

Cypress.Commands.add('searchReport', (user) => {
    cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Regulations")').click({multiple: true});
    cy.xpath("//div[@class='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto']").find(':contains("Report")').click({multiple: true});
    cy.xpath('//button[text()="Select"]').click();
    cy.wait(200);
    cy.contains('div', 'Search').parent().find('input').type('first-name', {force:true});
    cy.contains('div', user).click({force: true});
    cy.wait(500);
    cy.xpath('//button[text()="Save"]').click();
    cy.xpath('//button[text()="Show results"]').click();
})

Cypress.Commands.add('visitAdmin', (user) => {
    cy.get("[data-header-test-id='header_menu_button']").click();
    cy.get("[data-header-test-id='header_dropdown_menu']").eq(1).click();
    cy.wait(1000)
})
