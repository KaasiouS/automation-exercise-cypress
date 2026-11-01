const vitrine = require('../components/vitrine')

class HomePage {
  seletores = {
    carrossel: '#slider',
  }

  visitar() {
    cy.visit('/')
    return this
  }

  validarCarregada() {
    cy.title().should('eq', 'Automation Exercise')
    cy.get(this.seletores.carrossel).should('be.visible')
    vitrine.validarTitulo('Features Items')
    return this
  }
}

module.exports = new HomePage()
