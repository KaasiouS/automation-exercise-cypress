class CarrinhoPage {
  seletores = {
    linhas: '#cart_info_table tbody tr[id^="product-"]',
    linhaDoProduto: (id) => `#cart_info_table tr#product-${id}`,
    botaoCheckout: '#do_action .check_out',
  }

  validarProdutos(idsProdutos) {
    cy.location('pathname').should('eq', '/view_cart')
    cy.get(this.seletores.linhas).should('have.length', idsProdutos.length)
    idsProdutos.forEach((id) => cy.get(this.seletores.linhaDoProduto(id)).should('be.visible'))
    return this
  }

  irParaCheckout() {
    cy.get(this.seletores.botaoCheckout).click()
    return this
  }
}

module.exports = new CarrinhoPage()
