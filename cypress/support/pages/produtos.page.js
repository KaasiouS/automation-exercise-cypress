const vitrine = require('../components/vitrine')

class ProdutosPage {
  seletores = {
    campoBusca: '#search_product',
    botaoBuscar: '#submit_search',
    detalhe: '.product-information',
  }

  validarCarregada() {
    cy.location('pathname').should('eq', '/products')
    vitrine.validarTitulo('All Products').validarProdutosListados()
    return this
  }

  pesquisar(termo) {
    cy.get(this.seletores.campoBusca).type(termo)
    cy.get(this.seletores.botaoBuscar).click()
    return this
  }

  validarResultadoDaBusca(termo) {
    cy.location('search').should('eq', `?search=${encodeURIComponent(termo)}`)
    vitrine.validarTitulo('Searched Products').validarTodosOsNomesContem(termo)
    return this
  }

  // Os 6 dados exigidos pelo TC8: nome, categoria, preço, disponibilidade, condição e marca
  validarDetalheDoProduto(idProduto) {
    cy.location('pathname').should('eq', `/product_details/${idProduto}`)
    cy.get(this.seletores.detalhe).within(() => {
      cy.get('h2').invoke('text').should('not.be.empty')
      cy.contains('p', /^Category: .+/).should('be.visible')
      cy.contains('span', /^Rs\. \d+/).should('be.visible')
      cy.contains('p', /^Availability: .+/).should('be.visible')
      cy.contains('p', /^Condition: .+/).should('be.visible')
      cy.contains('p', /^Brand: .+/).should('be.visible')
    })
    return this
  }
}

module.exports = new ProdutosPage()
