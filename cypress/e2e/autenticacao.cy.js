/// <reference types="cypress" />
// Test Cases 1 a 5 — https://automationexercise.com/test_cases
const homePage = require('../support/pages/home.page')
const loginPage = require('../support/pages/login.page')
const cadastroPage = require('../support/pages/cadastro.page')
const cabecalho = require('../support/components/cabecalho')
const { excluirContaPelaInterface } = require('../support/fluxos')
const { novoUsuario, emailUnico } = require('../support/factories/usuario')

describe('Autenticação: cadastro, login e logout', () => {
  let usuario

  beforeEach(() => {
    usuario = novoUsuario()
    homePage.visitar().validarCarregada()
  })

  // Rede de segurança: remove a conta mesmo se o teste falhar antes de excluí-la pela interface
  afterEach(() => {
    cy.excluirContaViaApi(usuario)
  })

  it('TC1 - Cadastrar usuário', () => {
    cabecalho.irParaLogin()
    loginPage.validarCarregada().iniciarCadastro(usuario.nome, usuario.email)

    cadastroPage.validarCarregada().preencher(usuario).criarConta()
    cadastroPage.validarContaCriada().continuar()
    cabecalho.validarLogadoComo(usuario.nome)

    excluirContaPelaInterface()
  })

  it('TC2 - Login com e-mail e senha corretos', () => {
    cy.criarContaViaApi(usuario)

    cabecalho.irParaLogin()
    loginPage.validarCarregada().entrar(usuario.email, usuario.senha)
    cabecalho.validarLogadoComo(usuario.nome)

    excluirContaPelaInterface()
  })

  it('TC3 - Login com e-mail e senha incorretos', () => {
    cabecalho.irParaLogin()
    loginPage.validarCarregada().entrar(emailUnico('inexistente'), 'SenhaErrada123')

    loginPage.validarErroDeCredenciais()
    cabecalho.validarDeslogado()
  })

  it('TC4 - Logout de usuário', () => {
    cy.criarContaViaApi(usuario)

    cabecalho.irParaLogin()
    loginPage.validarCarregada().entrar(usuario.email, usuario.senha)
    cabecalho.validarLogadoComo(usuario.nome)

    cabecalho.sair()
    loginPage.validarCarregada()
    cabecalho.validarDeslogado()
  })

  it('TC5 - Cadastrar usuário com e-mail já existente', () => {
    cy.criarContaViaApi(usuario)

    cabecalho.irParaLogin()
    loginPage.validarCarregada().iniciarCadastro(usuario.nome, usuario.email)

    loginPage.validarErroDeEmailExistente()
  })
})
