// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});
import '@shelex/cypress-allure-plugin';
// Alternatively you can use CommonJS syntax:
// require('./commands')

require('@cypress/xpath');


['log', 'warn', 'error'].forEach((level) => {
  const original = console[level];
  console[level] = function (...args) {
    cy.task(`log${level.charAt(0).toUpperCase() + level.slice(1)}`, args.join(' '));
    original.apply(console, args);
  };
});
