// Component Object: rodapé com a assinatura da newsletter ("Subscription")
class Rodape {
  seletores = {
    rodape: '#footer',
    tituloAssinatura: '.single-widget h2',
    email: '#susbscribe_email', // grafia original do id no site
    botaoAssinar: '#subscribe',
    mensagemSucesso: '#success-subscribe',
  }

  assinarNewsletter(email) {
    cy.get(this.seletores.rodape).scrollIntoView()
    cy.get(this.seletores.rodape)
      .find(this.seletores.tituloAssinatura)
      .should('be.visible')
      .and('have.text', 'Subscription')
    cy.get(this.seletores.email).type(email)
    cy.get(this.seletores.botaoAssinar).click()
    return this
  }

  validarAssinaturaConfirmada() {
    cy.get(this.seletores.mensagemSucesso)
      .should('be.visible')
      .and('contain.text', 'You have been successfully subscribed!')
    return this
  }
}

module.exports = new Rodape()
