const fetch = require("node-fetch");

const baseUrl = "https://api.mail.tm";

const emailApi = async () => {
    try {
        console.log("Проверка доступности API ");

        // Получаем список доступных доменов
        const domainsResponse = await fetch(`${baseUrl}/domains`);
        const domainsData = await domainsResponse.json();

        if (!domainsData["hydra:member"] || domainsData["hydra:member"].length === 0) {
            throw new Error(" Ошибка: API не вернул доступные домены.");
        }

        // Берем первый доступный домен
        const domain = domainsData["hydra:member"][0].domain;


        // Создаем временный email с новым доменом
        const accountResponse = await fetch(`${baseUrl}/accounts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                address: `test${Date.now()}@${domain}`,
                password: "TestEmail123",
            }),
        });

        const accountText = await accountResponse.text();
        console.log("RAW RESPONSE (Создание email):", accountText);

        if (!accountText) {
            throw new Error(" Mail.tm API вернул пустой ответ при создании аккаунта.");
        }

        const accountData = JSON.parse(accountText);

        if (!accountData.id) {
            throw new Error(" Ошибка при создании email.");
        }

        console.log(" Временный email создан:", accountData.address);

        // Логинимся, чтобы получить токен
        const loginResponse = await fetch(`${baseUrl}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                address: accountData.address,
                password: "TestEmail123",
            }),
        });

        const loginData = await loginResponse.json();
        const token = loginData.token;

        if (!token) {
            throw new Error("❌ Ошибка получения токена Mail.tm.");
        }


        const getEmailAccount = () => accountData.address;

        const getEmailData = async (retries = 8, delay = 10000) => {
            console.log(" Ожидание письма...");

            for (let i = 0; i < retries; i++) {
                try {
                    const messagesResponse = await fetch(`${baseUrl}/messages`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const messagesText = await messagesResponse.text();


                    if (!messagesText) {
                        throw new Error(" Mail.tm API вернул пустой ответ при проверке почты.");
                    }

                    const messages = JSON.parse(messagesText);

                    if (messages["hydra:member"].length > 0) {
                        const emailId = messages["hydra:member"][0].id;

                        const emailResponse = await fetch(`${baseUrl}/messages/${emailId}`, {
                            method: "GET",
                            headers: { Authorization: `Bearer ${token}` },
                        });

                        const emailData = await emailResponse.json();
                        return { html: emailData.html };
                    }
                } catch (error) {
                    console.error(" Ошибка при получении писем:", error);
                }

                console.log(` Письмо не найдено, повторная попытка (${i + 1}/${retries})...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }

            throw new Error(" Письмо так и не было получено.");
        };

        return { getEmailAccount, getEmailData };
    } catch (error) {
        console.log(" Ошибка работы с Mail.tm API:", error);
    }
};

module.exports = emailApi;
