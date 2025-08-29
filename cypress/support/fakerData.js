const { faker } = require('@faker-js/faker');

function generateUserData() {
    cy.task('logInfo', `Генерация данных`);
    return {
        userEmail: faker.internet.email(),              // случайный email
        pass: faker.internet.password(12, true, /[A-Za-z0-9]/), // случайный пароль
        pass_1: faker.internet.password(12, true, /[A-Za-z0-9]/), // случайный пароль
        invalid_code: faker.number.int({ min: 1000, max: 9999 }),         // 4-значный случайный код
        name: faker.name.firstName(),                  // случайное имя
        last_name: faker.name.lastName(),              // случайная фамилия
        test_password: faker.internet.password(12, true, /[A-Za-z0-9]/) // случайный тестовый пароль
    };
}

module.exports = { generateUserData };