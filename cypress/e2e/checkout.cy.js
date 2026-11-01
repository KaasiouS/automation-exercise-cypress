/// <reference types="cypress" />
// Test Cases 15 e 16 — https://automationexercise.com/test_cases
const homePage = require('../support/pages/home.page')
const carrinhoPage = require('../support/pages/carrinho.page')
const checkoutPage = require('../support/pages/checkout.page')
const cabecalho = require('../support/components/cabecalho')
const vitrine = require('../support/components/vitrine')
const { cadastrarPelaInterface, entrarPelaInterface, excluirContaPelaInterface } = require('../support/fluxos')
const { novoUsuario } = require('../support/factories/usuario')
const cartao = require('../fixtures/cartao.json')

// Produtos escolhidos pelo id (data-product-id), estáveis na vitrine da home
const PRODUTOS = [1, 2]

describe('Checkout: fazer pedido', () => {
  let usuario

  beforeEach(() => {
    usuario = novoUsuario()
    homePage.visitar().validarCarregada()
  })

  afterEach(() => {
    cy.excluirContaViaApi(usuario)
  })

  // Do carrinho à confirmação: parte comum aos dois cenários
  function finalizarCompra(comentario) {
    homePage.validarCarregada() // após cadastro/login o site volta para a home; a vitrine parte dela
    PRODUTOS.forEach((id) => vitrine.adicionarAoCarrinho(id))
    cabecalho.irParaCarrinho()
    carrinhoPage.validarProdutos(PRODUTOS).irParaCheckout()

    checkoutPage.validarEndereco(usuario).validarRevisaoDoPedido(PRODUTOS.length).fazerPedido(comentario)
    checkoutPage.pagar(cartao).validarPedidoConfirmado()
  }

  it('TC15 - Fazer pedido: cadastrar antes do checkout', () => {
    cadastrarPelaInterface(usuario)

    finalizarCompra('TC15: entregar em horário comercial.')

    excluirContaPelaInterface()
  })

  it('TC16 - Fazer pedido: login antes do checkout', () => {
    cy.criarContaViaApi(usuario)
    entrarPelaInterface(usuario)

    finalizarCompra('TC16: entregar em horário comercial.')

    excluirContaPelaInterface()
  })
})
