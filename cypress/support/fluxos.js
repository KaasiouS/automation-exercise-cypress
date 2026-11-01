// Facade: fluxos de negócio de várias páginas, reaproveitados como etapa de outros cenários.
// Cada passo continua com sua própria verificação, então uma falha aponta onde o fluxo quebrou.
const cabecalho = require('./components/cabecalho')
const loginPage = require('./pages/login.page')
const cadastroPage = require('./pages/cadastro.page')

function cadastrarPelaInterface(usuario) {
  cabecalho.irParaLogin()
  loginPage.validarCarregada().iniciarCadastro(usuario.nome, usuario.email)
  cadastroPage.validarCarregada().preencher(usuario).criarConta().validarContaCriada().continuar()
  cabecalho.validarLogadoComo(usuario.nome)
}

function entrarPelaInterface(usuario) {
  cabecalho.irParaLogin()
  loginPage.validarCarregada().entrar(usuario.email, usuario.senha)
  cabecalho.validarLogadoComo(usuario.nome)
}

function excluirContaPelaInterface() {
  cabecalho.excluirConta()
  cadastroPage.validarContaExcluida().continuar()
  cabecalho.validarDeslogado()
}

module.exports = { cadastrarPelaInterface, entrarPelaInterface, excluirContaPelaInterface }
