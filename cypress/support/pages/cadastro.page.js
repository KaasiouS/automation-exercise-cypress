// Página /signup ("Enter Account Information") e telas de resultado: conta criada / conta excluída
class CadastroPage {
  seletores = {
    titulo: '.login-form h2',
    opcaoTratamento: (titulo) => `input[name="title"][value="${titulo}"]`,
    senha: '[data-qa="password"]',
    dia: '[data-qa="days"]',
    mes: '[data-qa="months"]',
    ano: '[data-qa="years"]',
    newsletter: '#newsletter',
    ofertas: '#optin',
    primeiroNome: '[data-qa="first_name"]',
    sobrenome: '[data-qa="last_name"]',
    empresa: '[data-qa="company"]',
    logradouro: '[data-qa="address"]',
    complemento: '[data-qa="address2"]',
    pais: '[data-qa="country"]',
    estado: '[data-qa="state"]',
    cidade: '[data-qa="city"]',
    cep: '[data-qa="zipcode"]',
    celular: '[data-qa="mobile_number"]',
    botaoCriarConta: '[data-qa="create-account"]',
    contaCriada: '[data-qa="account-created"]',
    contaExcluida: '[data-qa="account-deleted"]',
    botaoContinuar: '[data-qa="continue-button"]',
  }

  validarCarregada() {
    cy.location('pathname').should('eq', '/signup')
    cy.get(this.seletores.titulo).first().should('be.visible').and('have.text', 'Enter Account Information')
    return this
  }

  preencher(usuario) {
    const { nascimento, endereco } = usuario
    const s = this.seletores

    cy.get(s.opcaoTratamento(usuario.titulo)).check()
    cy.get(s.senha).type(usuario.senha, { log: false })
    cy.get(s.dia).select(nascimento.dia)
    cy.get(s.mes).select(nascimento.mes)
    cy.get(s.ano).select(nascimento.ano)
    cy.get(s.newsletter).check()
    cy.get(s.ofertas).check()

    cy.get(s.primeiroNome).type(usuario.primeiroNome)
    cy.get(s.sobrenome).type(usuario.sobrenome)
    cy.get(s.empresa).type(endereco.empresa)
    cy.get(s.logradouro).type(endereco.logradouro)
    cy.get(s.complemento).type(endereco.complemento)
    cy.get(s.pais).select(endereco.pais)
    cy.get(s.estado).type(endereco.estado)
    cy.get(s.cidade).type(endereco.cidade)
    cy.get(s.cep).type(endereco.cep)
    cy.get(s.celular).type(usuario.celular)
    return this
  }

  criarConta() {
    cy.get(this.seletores.botaoCriarConta).click()
    return this
  }

  validarContaCriada() {
    cy.location('pathname').should('eq', '/account_created')
    cy.get(this.seletores.contaCriada).should('be.visible').and('have.text', 'Account Created!')
    return this
  }

  validarContaExcluida() {
    cy.location('pathname').should('eq', '/delete_account')
    cy.get(this.seletores.contaExcluida).should('be.visible').and('have.text', 'Account Deleted!')
    return this
  }

  continuar() {
    cy.get(this.seletores.botaoContinuar).click()
    return this
  }
}

module.exports = new CadastroPage()
