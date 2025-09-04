### op3-cypress-tests

### Requirements



# Установка nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
source ~/.bashrc   
npm -v

# Установка Node.js 20.5.1
nvm install 20.5.1
node -v


# Установка Yarn:        
npm install -g yarn@1.22.19
yarn -v

# Java 8+ (для Allure)
sudo apt update
sudo apt install openjdk-11-jdk -y
java -version

# Mailslurp Integration
Для работы с тестовыми email-сервисами:

npm install --save mailslurp-client

# Allure Commandline
npm install -g allure-commandline --save-dev
allure --version
yarn allure:report
allure open


# Getting Started
git clone <repository-url>
cd op3-cypress-tests
yarn
Создать .env файл из примера:
cp .env.example .env

### Running Tests
Запуск Cypress в интерактивном режиме (с GUI):

yarn cy:open


# Automated Tests
Запуск автоматических тестов и генерация Allure отчёта:

yarn cy:run
yarn allure:report
yarn allure:open

