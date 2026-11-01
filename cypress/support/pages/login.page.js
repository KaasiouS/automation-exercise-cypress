// Página /login: reúne o formulário de login e o início do cadastro (signup)
class LoginPage {
  seletores = {
    formLogin: '.login-form',
    loginEmail: '[data-qa="login-email"]',
    loginSenha: '[data-qa="login-password"]',
    botaoEntrar: '[data-qa="login-button"]',
    erroLogin: 'form[action="/login"] p',
    formCadastro: '.signup-form',
    cadastroNome: '[data-qa="signup-name"]',
    cadastroEmail: '[data-qa="signup-email"]',
    botaoCadastrar: '[data-qa="signup-button"]',
    erroCadastro: 'form[action="/signup"] p',
  }

  validarCarregada() {
    cy.location('pathname').should('eq', '/login')
    cy.get(this.seletores.formLogin).find('h2').should('have.text', 'Login to your account')
    cy.get(this.seletores.formCadastro).find('h2').should('have.text', 'New User Signup!')
    return this
  }

  entrar(email, senha) {
    cy.get(this.seletores.loginEmail).type(email)
    cy.get(this.seletores.loginSenha).type(senha, { log: false })
    cy.get(this.seletores.botaoEntrar).click()
    return this
  }

  iniciarCadastro(nome, email) {
    cy.get(this.seletores.cadastroNome).type(nome)
    cy.get(this.seletores.cadastroEmail).type(email)
    cy.get(this.seletores.botaoCadastrar).click()
    return this
  }

  validarErroDeCredenciais() {
    cy.get(this.seletores.erroLogin).should('be.visible').and('have.text', 'Your email or password is incorrect!')
    return this
  }

  validarErroDeEmailExistente() {
    cy.get(this.seletores.erroCadastro).should('be.visible').and('have.text', 'Email Address already exist!')
    return this
  }
}

module.exports = new LoginPage()
