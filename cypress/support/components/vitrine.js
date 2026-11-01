// Component Object: grade de produtos, compartilhada pela Home e pela página de produtos.
// Os produtos são localizados pelo id (data-product-id), não pela posição na tela.
class Vitrine {
  seletores = {
    titulo: '.features_items .title',
    card: '.features_items .product-image-wrapper',
    nomeNoCard: '.productinfo p',
    botaoAdicionar: (id) => `.features_items .productinfo a[data-product-id="${id}"]`,
    linkDetalhe: (id) => `.features_items a[href="/product_details/${id}"]`,
    modal: '#cartModal',
    botaoContinuarComprando: '#cartModal .close-modal',
  }

  validarTitulo(texto) {
    cy.get(this.seletores.titulo).should('be.visible').and('have.text', texto)
    return this
  }

  validarProdutosListados() {
    cy.get(this.seletores.card).should('have.length.greaterThan', 0).first().should('be.visible')
    return this
  }

  validarTodosOsNomesContem(termo) {
    cy.get(this.seletores.card)
      .should('have.length.greaterThan', 0)
      .find(this.seletores.nomeNoCard)
      .each(($nome) => {
        expect($nome.text().toLowerCase(), 'nome do produto').to.include(termo.toLowerCase())
      })
    return this
  }

  abrirDetalhe(idProduto) {
    cy.get(this.seletores.linkDetalhe(idProduto)).click()
    return this
  }

  adicionarAoCarrinho(idProduto) {
    cy.get(this.seletores.botaoAdicionar(idProduto)).click()
    cy.get(this.seletores.modal).should('be.visible').and('contain.text', 'Your product has been added to cart.')
    cy.get(this.seletores.botaoContinuarComprando).click()
    cy.get(this.seletores.modal).should('not.be.visible')
    return this
  }
}

module.exports = new Vitrine()
