// Ponto de entrada carregado antes de cada spec
import 'cypress-mochawesome-reporter/register'
import './api/conta'

// O retry pode esconder um teste instável: quando o teste roda de novo, o relatório registra isso.
// (Os screenshots das tentativas que falharam também entram no relatório: saveAllAttempts em cypress.config.js.)
beforeEach(() => {
  if (Cypress.currentRetry > 0) {
    cy.addTestContext(`INSTÁVEL: executado na tentativa ${Cypress.currentRetry + 1} (a anterior falhou)`)
  }
})
