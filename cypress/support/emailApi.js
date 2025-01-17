const { MailSlurp } = require('mailslurp-client');

const emailApi = async() => {
    try  {
        const mailslurp = new MailSlurp({ apiKey: "6d7ea33a0265e867786b4b744db25c3f677cab6516818650caefb2517649312c" });
        const inbox = await mailslurp.inboxController.createInboxWithDefaults();
        console.log('Временный email:',inbox);

        const getEmailAccount = () => {
            return inbox.emailAddress;
        }


        const getEmailData = async () => {
            //2. Ждём письмо (таймаут 30 секунд)
            console.log('Ожидание письма...');
            const email = await mailslurp.waitForLatestEmail(inbox.id, 30000);

            return {
                html:email.body
            };

        }

        return {
            getEmailAccount,
            getEmailData
        }
    }
    catch (e) {
        console.log("ERROR");
    }

}

module.exports = emailApi