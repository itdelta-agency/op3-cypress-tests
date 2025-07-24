import { ROUTES } from "./routes";

Cypress.Commands.add('login', (username = Cypress.env('email'), password = Cypress.env('password')) => {
    const hashCode = function (str) {
        str = "" + str;
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    cy.session([username, hashCode(password)], () => {
        cy.visit(Cypress.config('baseUrl') + 'login', { timeout: 10000 });

        cy.xpath("//input[@id='email']", { timeout: 10000 }).type(username);
        cy.xpath("//input[@id='password']", { timeout: 10000 }).type(password, { log: false });

        cy.xpath("//button[@type='submit']", { timeout: 10000 }).click();
        cy.wait(2000);
        cy.window().its('localStorage').invoke(`setItem`, 'tableFilterExpanded_/cp/admin/post', 'false')
        cy.window().its('localStorage').invoke(`setItem`, 'tableFilterExpanded_/st/admin/index', 'false')
    });

});
// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('resetAppState', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
        win.sessionStorage.clear();
    });
});

// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('checkTextPresence', (text) => {
    return cy.get('body').then(($body) => {
        return $body.text().includes(text);
    });
});

// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('admin', () => {
    cy.login();
    cy.visit('/')
    cy.visitAdmin();
    cy.wait(1000);
    // cy.get('body').then(($body) => {
    //     if($body.find('.inline-block.align-bottom.bg-white button').length) {
    //         return '.inline-block.align-bottom.bg-white button';
    //     }

    //     return 'body';
    // })
    //     .then(selector => {
    //         cy.get(selector).click();
    //     })

    cy.wait(1000);
});

// -----------------------------------------------------------------------------------------------------------------------
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
// -----------------------------------------------------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('question', (questionName, questionType) => {

    // cy.xpath("//div[@class='flex items-center cursor-pointer mb-3']").click();
    cy.xpath("//h2[text()='Add question']").click();

    // // cy.xpath("//*[text()=Создание вопроса']").should('be.visible');
    cy.xpath("(//input[@type='text'])[1]").type(questionName);
    cy.xpath("(//input[@type='text'])[2]").type(questionName + questionType);

    cy.xpath("(//div[@role='radio'])[" + questionType + "]").click({ force: true });
    cy.xpath("(//div[@role='radio'])[" + questionType + "]").click({ force: true });

    questionType === 1 && cy.xpath("//button[@role='switch']").click();
    if (questionType !== 1) {
        cy.addAnswers();
        cy.xpath("//button[@role='switch']").click();
    }
    // cy.xpath("//input[@type='number']").type(10);
    cy.xpath("//button[text()='Save']").click();
    cy.wait(1500);
    cy.contains("Success").should('be.visible');
});
// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('bulkAction', (actions, nameOrNames) => {
    const nameList = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];

    // Если панель не раскрыта — кликаем по тултипу
    cy.get('body').then($body => {
        if ($body.find('.mt-1.relative.flex').length === 0) {
            cy.xpath("//div[@class='tooltip']").click();
        }
    });

    actions.forEach(action => {
        // Отмечаем чекбоксы по каждому имени отдельно
        nameList.forEach(name => {
            cy.wait(200);
            // Вводим имя для фильтрации таблицы
            cy.get('input[placeholder="Search"]').eq(0)
                .scrollIntoView()
                .should('be.visible')
                .clear();

            cy.wait(200); // небольшой таймаут для стабилизации DOM

            cy.get('input[placeholder="Search"]').eq(0)
                .type(name, { delay: 100 });
            cy.wait(700); // ждем, чтобы таблица обновилась

            // Отмечаем все строки, которые содержат это имя
            cy.get('tbody tr[role="row"]', { timeout: 5000 }) // можно увеличить таймаут до 8000-10000 при необходимости
                .should('exist');
            cy.get('tbody tr[role="row"]')
                .filter(`:contains("${name}")`)
                .each($row => {
                    cy.wrap($row)
                        .find('input[type="checkbox"][title="Toggle Row Selected"]')
                        .check({ force: true });
                });
        });

        // Открываем выпадающий список действий
        cy.get('.z-10.flex')
            .filter((index, el) => Cypress.$(el).find('.css-19bb58m').length > 0)
            .first()
            .within(() => {
                cy.get('.css-19bb58m').should('be.visible').click();
            });

        // Выбираем действие
        cy.contains('div', action, { timeout: 5000 }).should('be.visible').click();

        // Нажимаем Apply
        cy.contains('button', 'Apply').should('be.visible').click();
        cy.wait(400);

        // Подтверждаем действие, если появляется модалка
        const confirmButtonText = action.toLowerCase() === 'delete' ? 'Delete' : 'OK';

        cy.get('body').then($body => {
            const $modal = $body.find('.bg-green-600, .bg-indigo-600');
            if ($modal.length > 0) {
                cy.wrap($modal).should('be.visible').contains(confirmButtonText).click();
            }
        });

        // Ждем обновления таблицы после действия
        cy.wait(700);

        // Проверяем статус для каждого имени после действия
        nameList.forEach(name => {
            // Снова фильтруем таблицу по имени
            cy.wait(300);
            cy.get('input[placeholder="Search"]').eq(0).clear().type(name, { delay: 100 });
            cy.wait(700);

            if (action.toLowerCase() === 'delete') {
                // Проверяем, что запись удалена
                cy.contains(name, { timeout: 3000 }).should('not.exist');
            } else {
                // Проверяем статус для каждой строки с этим именем
                cy.get('tbody tr[role="row"]')
                    .filter(`:contains("${name}")`)
                    .each($row => {
                        cy.wrap($row).within(() => {
                            switch (action.toLowerCase()) {
                                case 'activate':
                                    cy.contains('span', 'Active', { timeout: 5000 }).should('exist');
                                    cy.wait(100);
                                    break;
                                case 'deactivate':
                                    cy.url().then(url => {
                                        const expectedStatus = url.includes(ROUTES.users) ? 'Blocked' : 'Inactive';
                                        cy.contains('span', expectedStatus, { timeout: 5000 }).should('exist');
                                        cy.wait(100);
                                    });
                                    break;
                                default:
                                    throw new Error(`Неизвестное массовое действие: ${action}`);
                            }
                        });
                    });
            }
        });

        // Проверка уведомления (необязательно)
        cy.get('body').then($body => {
            const $notify = $body.find('.bg-green-600, .bg-indigo-600');
            if ($notify.length > 0) {
                cy.wrap($notify).should('be.visible').then($el => {
                    cy.log('Уведомление:', $el.text().trim());
                });
            } else {
                cy.log('Уведомление об успехе не появилось');
            }
        });
    });
});

// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('closePopup', () => {
    const isNonExistentOrHidden = ($el => Cypress.dom.isElement($el));

    cy.wait(1000);
    cy.contains("span", "Attention!").should(($el) => {
        if (!isNonExistentOrHidden($el)) {
            expect(isNonExistentOrHidden($el)).to.be.false
        }

    }).then((res) => {
        if (res.length) {
            cy.contains("span", "Attention!").parent().parent().next().find('button').click();
            cy.wait(500);
        }
    })
    cy.wait(1000)
});
// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('accessAllItems', () => {
    cy.wait(2000);
    // cy.xpath('(//button/span[starts-with(text(), \'Show\')])[last()]').click();
    cy.get('[data-test-id="pageCountButton"]').scrollIntoView().click();
    cy.wait(1000);
    cy.get('.font-normal.block').eq(3).click()
    cy.wait(1000);
});


// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('changeLang', (lang = 'ru') => {
    cy.get('[data-header-test-id="lang_button"]').click();
    cy.wait(500);
    cy.get(`[data-header-test-id=${lang}]`).click();
    cy.wait(500);
});
// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('changeLangAuth', () => {
    cy.xpath("/html/body/div[2]/div/nav/div/div/div[2]/div/div/button").click();
    cy.wait(500);
    cy.xpath("/html/body/div[2]/div/nav/div/div/div[2]/div/div").find('a').last().click();
    cy.wait(500);
})
// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('logout', () => {
    cy.wait(1500);
    cy.xpath("//button[@class='max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-50']").click();
    cy.wait(500);
    cy.xpath("//a[@href='" + Cypress.config('baseUrl') + "logout']").click();
    cy.wait(1500);
});
// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('searchRow', (name) => {
    // Проверяем, включены ли фильтры — безопаснее через then
    cy.get('body').then($body => {
        if ($body.find('.mt-1.relative.flex').length === 0) {
            cy.xpath("//div[@class='tooltip']").click();
        }
    });

    cy.get('[placeholder="Search"], [placeholder="Поиск"]').first()
        .should('be.visible')
        .clear()
        .wait(100)
        .type(name, { delay: 100 });

    cy.wait(500);

    // Ждём, пока отфильтрованные строки появятся (лучше, чем wait)
    cy.contains('tr', name, { timeout: 5000 }).should('be.visible');
});
// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('skipTests', (cookieName) => {
    if (Cypress.browser.isHeaded) {
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

// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('whoCanSee', (tabs = ['Users', 'Teams', 'Others']) => {
    const tabSearchValues = {
        'Users': 'first-name',
        'Teams': 'Qa Test Team',
        'Others': 'All users',
    };

    cy.xpath('//button[text()="Select"]').click();
    cy.wait(200);

    Cypress._.each(tabs, (tab) => {
        cy.get('.-mb-px.flex').then(($nav) => {
            if ($nav.find(`div:contains("${tab}")`).length > 0) {
                cy.wrap($nav).contains('div', tab).click();
                cy.wait(200);
                cy.contains('div', 'Search').parent().find('input').type(tabSearchValues[tab], { force: true });
                cy.contains('div', tabSearchValues[tab], { timeout: 1000 }).click({ force: true });
                cy.wait(500);
            } else {
                cy.log(`Вкладка "${tab}" отсутствует — пропускаем`);
            }
        });
    });

    cy.get('.mt-3.w-full').click();

    // Проверка наличия результата
    cy.get('.w-full.max-h-24')
        .children('li')
        .should('be.visible');
});

// -----------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('visitAdmin', (user) => {
    cy.get("[data-header-test-id='header_menu_button']").click();
    cy.get("[data-header-test-id='header_dropdown_menu']").eq(1).click();
    cy.wait(1000)
})
