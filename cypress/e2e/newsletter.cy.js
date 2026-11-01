/// <reference types="cypress" />
// Test Case 10 — https://automationexercise.com/test_cases
const homePage = require('../support/pages/home.page')
const rodape = require('../support/components/rodape')
const { emailUnico } = require('../support/factories/usuario')

describe('Newsletter', () => {
  it('TC10 - Verificar assinatura da newsletter na home', () => {
    homePage.visitar().validarCarregada()

    rodape.assinarNewsletter(emailUnico('newsletter'))

    rodape.validarAssinaturaConfirmada()
  })
})
