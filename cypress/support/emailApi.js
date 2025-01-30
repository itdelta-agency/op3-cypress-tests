const { MailSlurp } = require('mailslurp-client');


const emailApi = async () => {
    try {
        const mailslurp = new MailSlurp({
            apiKey: "6d7ea33a0265e867786b4b744db25c3f677cab6516818650caefb2517649312c",
            basePath: "https://api.mailslurp.com"
        });

        const inboxes = await mailslurp.getInboxes();
        for (const inbox of inboxes) {
            console.log(`Удаление почтового ящика: ${inbox.id}`);
            await mailslurp.deleteInbox(inbox.id);
        }

        const inbox = await mailslurp.createInbox();
        console.log('Временный email:', inbox.emailAddress);

        const getEmailAccount = () => inbox.emailAddress;

        const getEmailData = async () => {
            console.log('Ожидание письма...');
            try {
                const email = await mailslurp.waitForLatestEmail(inbox.id, 30000);
                return { html: email.body };
            } catch (error) {
                console.log('Ошибка ожидания письма:', error);
            }
        };

        return { getEmailAccount, getEmailData };
    } catch (error) {
        console.log("ERROR", error);
    }
};

module.exports = emailApi;