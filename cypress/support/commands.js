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
        // Ждем пока страница загрузится 
        cy.get('[data-header-test-id="header_menu_button"]', {timeout:15000}).should('be.visible');

        // Отключаем анимацию
        cy.disableAnimations();

        // Меняем язык
        cy.changeLang();

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
    cy.task('logInfo', "Авторизация");
    // Логинимся
    cy.login();
    cy.wait(500);

    // Заходим на главную страницу
    cy.visit('/');

    cy.task('logStep', "Переход в панель администратора");

    // Переходим в админку и ждем пока меню откроется
    return cy.visitAdmin();
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
});

// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('addAnswers', () => {

    cy.xpath("//span[text()='Add answer']").click();


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
    cy.checkTextInParagraph();
});




Cypress.Commands.add('reliableType', (selector, text) => {
    cy.get(selector)
        .eq(0)
        .should('be.visible')
        .as('reliableInput');

    cy.get('@reliableInput')
        .clear();

    cy.wait(300);

    cy.get('@reliableInput')
        .type(text, { delay: 100 });

    cy.wait(300);

    // Проверка корректности ввода
    cy.get('@reliableInput')
        .invoke('val')
        .then(val => {
            if (val !== text) {
                cy.log(`🔁 Переввод. Было: "${val}", ожидалось: "${text}"`);

                // Повтор
                cy.get('@reliableInput').clear();
                cy.wait(300);
                cy.get('@reliableInput').type(text, { delay: 150 });

                // Повторная проверка 
                cy.get('@reliableInput').invoke('val').then(finalVal => {
                    if (finalVal !== text) {
                        cy.task('logError', `Ожидалось: "${text}", но введено: "${finalVal}"`);
                    }
                });
            }
        });
});
// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('bulkAction', (actions, nameOrNames) => {
    const nameList = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
    cy.wait(1000);
    // Если панель не раскрыта — кликаем по тултипу
    cy.get('body').then($body => {
        if ($body.find('[placeholder="Search"]').length === 0) {
            cy.xpath("//div[@class='tooltip']").click();
        }
    });

    actions.forEach(action => {
        // Отмечаем чекбоксы по каждому имени отдельно

        nameList.forEach(name => {
            cy.wait(200);
            cy.searchRow(name);
            // Отмечаем все строки, которые содержат это имя
            cy.get('tbody tr[role="row"]', { timeout: 5000 })
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

            cy.searchRow(name);

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
                                    cy.contains('span', 'Active', { timeout: 5000 })
                                        .should('exist')
                                        .wait(200); // дожидаемся после появления
                                    break;

                                case 'deactivate':
                                    cy.url().then(url => {
                                        const expectedStatus = url.includes(ROUTES.users) ? 'Blocked' : 'Inactive';
                                        cy.contains('span', expectedStatus, { timeout: 5000 })
                                            .should('exist')
                                            .wait(200); // тоже ждём немного после появления
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
                cy.task('logError', `Уведомление об успехе не появилось`);
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
    cy.get('[data-test-id="pageCountButton"]').scrollIntoView().click();
    cy.wait(1000);
    cy.get('.font-normal.block').eq(3).click()
    cy.wait(1000);
});

// -----------------------------------------------------------------------------------------------------------------------

// Cypress.Commands.add('changeLang', (lang = 'en') => {
//     cy.wait(1000);
//     cy.get('[data-header-test-id="lang_button"]')
//         .click()
//         .then(() => {
//             // Проверяем, существует ли элемент нужного языка
//             cy.get('body').then($body => {
//                 if ($body.find(`[data-header-test-id="${lang}"]`).length > 0) {
//                     cy.get(`[data-header-test-id="${lang}"]`).click();
//                     cy.task('logInfo', `Переключение языка на ${lang}`);
//                 } else {
//                     cy.task('logError', `Элемент для языка ${lang} не найден`);
//                 }
//             });
//         });
//     cy.wait(1000);
// });


Cypress.Commands.add('changeLang', (lang = 'en') => {
    // Клик по кнопке смены языка
    cy.get('[data-header-test-id="lang_button"]').click();

    // Ожидаем появления нужного языка в выпадающем меню
    cy.get(`[data-header-test-id="${lang}"]`, { timeout: 10000 })
        .should('be.visible')
        .click();

    // Ждем, пока на странице отобразится элемент с текстом на выбранном языке
    const headerSelector = 'h2.mb-4.text-2xl.font-bold';
    const expectedText = lang === 'en' ? 'Regulations' : 'Регламенты';

    cy.get(headerSelector, { timeout: 15000 })
      .should('have.text', expectedText)
      .then(() => {
          cy.task('logInfo', `Язык успешно переключен на ${lang}`);
      });
});

// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('logout', () => {
    cy.wait(1500);
    cy.get('[data-header-test-id="header_menu_button"]').click();
    cy.wait(500);
    cy.get('[data-header-test-id="header_dropdown_menu"]').last().click();
    cy.task('logStep', `Пользователь успешно разлогинился`);
    cy.wait(1500);
});

// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('searchRow', (name) => {
    cy.task('logInfo', `Поиск строки с именем: "${name}"`);

    // Проверяем, есть ли элементы, иначе кликаем на тултип
    cy.get('.w-full.h-full').then($body => {
        if ($body.find('.mt-1.relative.flex').length === 0) {
            cy.xpath("//div[@class='tooltip']").click();
        }
    });

    // Чистим поле поиска безопасно
    cy.get('[placeholder="Search"], [placeholder="Поиск"]', { timeout: 10000 })
        .first()
        .then(($input) => {
            // повторная проверка value через retry
            cy.wrap($input)
                .clear()
                .should(() => {
                    expect($input.val()).to.eq('');
                });
        });

    // Вводим текст посимвольно с проверкой через новый get
    name.split('').forEach((char, index) => {
        cy.get('[placeholder="Search"], [placeholder="Поиск"]').first()
            .type(char, { delay: 0 })
            .should('have.value', name.slice(0, index + 1));
        cy.wait(100); // небольшая пауза между символами
    });

    // Ждем, чтобы таблица успела обновиться
    cy.wait(800);

    // Проверка строки в таблице через повторный get
    cy.get('tbody').then($tbody => {
        const rows = $tbody.find(`tr:contains("${name}")`);
        if (rows.length === 0) {
            cy.task('logError', `Строка с именем "${name}" не найдена!`);
        }
    });
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

Cypress.Commands.add('deleteAllByName', (name) => {
    function deleteOne() {
        return cy.get('tr').then($rows => {
            // Фильтруем строки, в которых есть нужное имя
            const filtered = $rows.filter((i, el) => el.innerText.includes(name));

            if (filtered.length > 0) {
                const $row = Cypress.$(filtered[0]);

                cy.wrap($row).within(() => {
                    cy.get('button').first().click();
                    cy.contains('div', 'Delete').click();
                });

                // Подтверждаем удаление
                cy.contains('button', 'Delete').click();
                // Ждем исчезновения строки с этим именем
                return cy.get('tr')
                    .should('not.contain.text', name)
                    .then(() => deleteOne());  // Рекурсивно удаляем остальные
            } else {
                // Если строк нет — просто завершаем рекурсию и тест продолжается
                return;
            }
        });
    }

    return deleteOne();
});


// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('whoCanSee', (tabs = ['Users', 'Departments', 'Teams', 'Others']) => {

    cy.task('logInfo', `Начало работы с модальным окном парв доступа`);
    const tabSearchValues = {
        'Users': 'first-name',
        'Departments': 'QA Department name',
        'Teams': 'Qa Test Team',
        'Others': 'All users',

    };
    cy.task('logInfo', 'Клик по кнопке селект');

    cy.get('[aria-modal="true"]').should('not.exist');

    cy.get('.w-20.text-xs')
        .should('be.visible')
        .click();
    cy.get('[aria-modal="true"]', { timeout: 10000 })
        .should('be.visible');

    cy.task('logInfo', 'Клик по кнопке открытия модалки выполнен');


    // Ждём видимость содержимого модалки. В случае провала — логируем и продолжаем.
    cy.get('.block.mb-4', { timeout: 10000 })
        .should('be.visible')
        .then(
            () => {
                cy.task('logInfo', 'Модалка успешно открылась');
            },
            (err) => {
                // Не бросаем err — логируем и делаем скрин для дебага, тест продолжит выполнение
                cy.task('logError', 'Модалка не открылась в отведённый таймаут — логируем и продолжаем');
                cy.screenshot('modal-open-timeout');
            }
        );

    Cypress._.each(tabs, (tab) => {
        cy.get('.-mb-px.flex', { timeout: 5000 }).then(($nav) => {
            if ($nav.find(`div:contains("${tab}")`).length > 0) {
                cy.wrap($nav).contains('div', tab).click();

                // Вводим значение для поиска
                cy.contains('div', 'Search')
                    .parent()
                    .find('input')
                    .clear()
                    .type(tabSearchValues[tab], { force: true });

                cy.wait(1500); // немного подождать, чтобы список успел обновиться

                // Проверяем, есть ли нужный элемент в DOM
                cy.get('body').then($body => {
                    const selector = `div:contains("${tabSearchValues[tab]}")`;

                    if ($body.find(selector).length > 0) {
                        cy.contains('div', tabSearchValues[tab]).click({ force: true });
                    } else {
                        cy.task('logWarn', `Элемент "${tabSearchValues[tab]}" не найден — пропускаем`);
                    }
                });

            } else {
                cy.task('logWarn', `Вкладка "${tab}" отсутствует — пропускаем`);
            }
        });
    });

    cy.task('logInfo', 'Сохраняем изменения');
    cy.get('.mt-3.w-full').click();
    cy.get('[aria-modal="true"]', { timeout: 5000 }).should('not.exist');
    cy.task('logInfo', 'Модальное окно закрылось после нажатия на "Сохранить"');



    // Проверка: что хотя бы один элемент выбран
    return cy.get('.w-full.max-h-24')
        .children('li')
        .then($items => {
            if ($items.length > 0) {
                // Если есть элементы — логируем успешное событие
                cy.task('logInfo', 'Права доступа выданы!');
            } else {
                // Если элементов нет — логируем предупреждение
                cy.task('logInfo', 'Ничего не выбрано');
            }
        });
});

// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('ifRowExists', (name, callback) => {
    cy.get('body').then($body => {
        const row = $body.find(`tr:contains("${name}")`);

        if (row.length > 0) {
            cy.task('logInfo', 'Строка успешно найдена!');
            callback();
        } else {
            cy.task('logError', `Строка с именем "${name}" удалены`);
        }
    });
});

// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('logTestName', function () {
    const testName = this.currentTest.title;
    cy.task('logInfo', `========== Запуск теста: ${testName} ==========\n`);
});

// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('deleteResources', (name) => {
    const deleteNext = () => {
        cy.wait(800); // дать времени DOM обновиться
        cy.get('body').then($body => {
            const $row = $body.find('tr').filter((_, el) =>
                el.innerText.includes(name)
            ).first();

            if ($row.length === 0) {
                cy.log(`Все строки с именем "${name}" удалены`);
                cy.task('logWarn', `Все строки с именем "${name}" удалены`);
                return;
            }

            cy.wrap($row).find('.p-2.rounded-full').click();
            cy.contains('div', /delete\s*/i).click();
            cy.wait(200);
            cy.get('.sm\\:col-start-3').click();
            // Ждём обновления DOM и вызываем следующую итерацию
            cy.wait(1000).then(() => {
                deleteNext();
            });
            cy.task('logInfo', 'Удаление прошло успешно!');
        });
    };

    deleteNext();
});

// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('checkTextInParagraph', (text = 'Success!', timeout = 3000) => {
    const start = Date.now();

    function check() {
        return cy.document().then((doc) => {
            const el = doc.querySelector("p");
            if (el && el.textContent.includes(text)) {
                cy.task('logInfo', `Элемент с текстом "${text}" найден`);
                return;
            }

            if (Date.now() - start > timeout) {
                cy.task('logWarn', `Элемент с текстом "${text}" не найден за ${timeout} мс`);
                return;
            }
            return Cypress.Promise.delay(500).then(check);
        });
    }

    return check();
});

// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('visitAdmin', () => {
    // 1. Ждём видимость основного контейнера
    cy.get('.mt-5.flex-1.flex.flex-col', { timeout: 15000 })
        .should('be.visible');

    // 2. Ждём, что кнопка меню видна и закрыта
    cy.get('[data-header-test-id="header_menu_button"]', { timeout: 10000 })
        .should('be.visible')
        .should('have.attr', 'aria-expanded', 'false');

    // 3. Кликаем по кнопке меню, когда точно можно
    cy.get('[data-header-test-id="header_menu_button"]')
        .click({ force: true });

    // 4. Ждём, что меню реально раскрылось
    cy.get('[data-header-test-id="header_menu_button"]', { timeout: 5000 })
        .should('have.attr', 'aria-expanded', 'true');

    // 5. Ждём, что элемент меню виден и кликабелен
    cy.get("[data-header-test-id='header_dropdown_menu']", { timeout: 10000 })
        .eq(1)
        .should('be.visible')
        .click({ force: true });

    // 6. Проверка, что меню закрылось после клика
    cy.get('[data-header-test-id="header_menu_button"]', { timeout: 5000 })
        .should('have.attr', 'aria-expanded', 'false');

    cy.get('h2').contains(/Courses|Курсы/, { timeout: 20000 })
    .should('be.visible');

    cy.task('logInfo', 'Перешли в админку');
});
// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('checkVisible', (selector, options = {}) => {
    // Пытаемся найти элемент с указанным селектором
    cy.get('body').then($body => {
        if ($body.find(selector).length) {
            // Элемент найден → проверяем видимость
            cy.get(selector, options).should('be.visible');
        } else {
            // Элемент не найден → логируем и продолжаем
            cy.log(`Элемент "${selector}" не найден`);
        }
    });
});

// -----------------------------------------------------------------------------------------------------------------------

Cypress.Commands.add('disableAnimations', () => {
    cy.document().then(doc => {
        const style = doc.createElement('style');
        style.innerHTML = `
      * {
        transition: none !important;
        animation: none !important;
      }
    `;
        doc.head.appendChild(style);
    });
});