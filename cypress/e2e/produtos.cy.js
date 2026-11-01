/// <reference types="cypress" />
// Test Cases 8 e 9 — https://automationexercise.com/test_cases
const homePage = require('../support/pages/home.page')
const produtosPage = require('../support/pages/produtos.page')
const cabecalho = require('../support/components/cabecalho')
const vitrine = require('../support/components/vitrine')

describe('Produtos: listagem, detalhe e busca', () => {
  beforeEach(() => {
    homePage.visitar().validarCarregada()
    cabecalho.irParaProdutos()
    produtosPage.validarCarregada()
  })

  it('TC8 - Verificar todos os produtos e o detalhe de um produto', () => {
    const primeiroProduto = 1

    vitrine.abrirDetalhe(primeiroProduto)

    produtosPage.validarDetalheDoProduto(primeiroProduto)
  })

  it('TC9 - Pesquisar produto', () => {
    const termo = 'Jeans'

    produtosPage.pesquisar(termo)

    produtosPage.validarResultadoDaBusca(termo)
  })
})
