const makeEmailAccount = require('./email-account');

const emailApi = async () => {
  try {
    console.log("Инициализация email аккаунта через makeEmailAccount...");
    
    const account = await makeEmailAccount();

    const getEmailAccount = () => account.user.email;

    const getEmailData = async (timeout = 80000) => {
      console.log("Ожидание письма...");
      const email = await account.getLastEmail(timeout);

      if (!email) {
        throw new Error("Письмо так и не было получено.");
      }

      return { html: email.html };
    };

    const getConfirmationLink = async () => {
      return await account.getConfirmationLink();
    };

    return {
      getEmailAccount,
      getEmailData,
      getConfirmationLink,
    };

  } catch (error) {
    console.error("Ошибка в emailApi:", error);
    throw error;
  }
};

module.exports = emailApi;