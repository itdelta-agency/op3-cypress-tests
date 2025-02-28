const fetch = require("node-fetch");

const baseUrl = "https://api.guerrillamail.com/ajax.php";

const emailApi = async () => {
    try {
        // Генерация временного email
        console.log("Создание временного email...");
        const response = await fetch(`${baseUrl}?f=get_email_address`);
        const data = await response.json();

        if (!data.email_addr) {
            throw new Error("Не удалось создать временный email.");
        }

        const emailAddress = data.email_addr;
        const sidToken = data.sid_token;
        console.log("Временный email:", emailAddress);

        /**
         * Функция для получения email-адреса
         * @returns {string} email
         */
        const getEmailAccount = () => emailAddress;

        /**
         * Функция для получения последнего письма
         * @returns {Promise<object>} html-содержимое письма
         */
        const getEmailData = async (retries = 5, delay = 5000) => {
            console.log("Ожидание письма...");

            for (let i = 0; i < retries; i++) {
                try {
                    // Проверяем почту
                    const checkInboxResponse = await fetch(`${baseUrl}?f=check_email&sid_token=${sidToken}`);
                    const inboxData = await checkInboxResponse.json();

                    if (inboxData.list && inboxData.list.length > 0) {
                        const emailId = inboxData.list[0].mail_id;
                        console.log("Получено письмо с ID:", emailId);

                        // Получаем письмо по ID
                        const emailResponse = await fetch(`${baseUrl}?f=fetch_email&sid_token=${sidToken}&email_id=${emailId}`);
                        const emailData = await emailResponse.json();

                        return { html: emailData.mail_body };
                    }
                } catch (error) {
                    console.log("Ошибка при получении письма:", error);
                }

                console.log(`Письмо не найдено, повторная попытка (${i + 1}/${retries})...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }

            throw new Error("Письмо так и не было получено.");
        };

        return { getEmailAccount, getEmailData };
    } catch (error) {
        console.log("Ошибка работы с Guerrilla Mail API:", error);
    }
};

module.exports = emailApi;
