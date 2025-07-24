const nodemailer = require('nodemailer')
const { ImapFlow } = require('imapflow');
const simpleParser = require('mailparser').simpleParser

const makeEmailAccount = async () => {
    // Generate a new Ethereal email inbox account
    const testAccount = await nodemailer.createTestAccount()
    emailApi
    // console.log(111, testAccount);

    console.log('created new email account %s', testAccount.user)
    console.log('for debugging, the password is %s', testAccount.pass)

    const userEmail = {
        user: {
            email: testAccount.user,
            pass: testAccount.pass
        },

        /**
         * Utility method for getting the last email
         * for the Ethereal email account using ImapFlow.
         */
        async getLastEmail() {
            // Create imap client to connect later to the ethereal inbox and retrieve emails using ImapFlow
            let client = new ImapFlow({
                host: 'ethereal.email',
                port: 993,
                secure: true,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            // Wait until client connects and authorizes
            await client.connect();

            let message;

            // Select and lock a mailbox. Throws if mailbox does not exist
            let lock = await client.getMailboxLock('INBOX');
            try {
                // fetch latest message source
                // client.mailbox includes information about currently selected mailbox
                // "exists" value is also the largest sequence number available in the mailbox
                message = await client.fetchOne(client.mailbox.exists, { source: true });
                console.log("The message: %s", message.source?.toString());

                // list subjects for all messages
                // uid value is always included in FETCH response, envelope strings are in unicode.
                for await (let message of client.fetch('1:*', { envelope: true })) {
                    console.log(`${message.uid}: ${message.envelope.subject}`);
                }
            } finally {
                // Make sure lock is released, otherwise next `getMailboxLock()` never returns
                lock.release();
            }

            // log out and close connection
            await client.logout();

            const mail = await simpleParser(
                message.source
            )
            console.log(mail.subject)
            console.log(mail.text)

            // and returns the main fields + attachments array
            return {
                subject: mail.subject,
                text: mail.text,
                html: mail.html,
                attachments: mail.attachments
            }
        },

        /**
         * Utility method for sending an email
         * to the Ethereal email account created above.
         */
        async sendEmail() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: "bar@example.com, baz@example.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
                attachments: [
                    {
                        filename: 'hello.json',
                        content: JSON.stringify({
                            name: "Hello World!"
                        })
                    }
                ]
            });
            console.log("Message sent: %s", info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            return info.messageId
        }
    }
    return userEmail
}

module.exports = makeEmailAccount
