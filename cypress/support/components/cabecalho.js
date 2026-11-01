// Component Object: menu superior, presente em todas as páginas
class Cabecalho {
  seletores = {
    menu: '.shop-menu',
    linkProdutos: 'a[href="/products"]',
    linkCarrinho: 'a[href="/view_cart"]',
    linkLogin: 'a[href="/login"]',
    linkLogout: 'a[href="/logout"]',
    linkExcluirConta: 'a[href="/delete_account"]',
    nomeDoUsuario: 'b',
  }

  #clicarNoMenu(seletor) {
    cy.get(this.seletores.menu).find(seletor).click()
    return this
  }

  irParaLogin() {
    return this.#clicarNoMenu(this.seletores.linkLogin)
  }

  irParaProdutos() {
    return this.#clicarNoMenu(this.seletores.linkProdutos)
  }

  irParaCarrinho() {
    return this.#clicarNoMenu(this.seletores.linkCarrinho)
  }

  sair() {
    return this.#clicarNoMenu(this.seletores.linkLogout)
  }

  excluirConta() {
    return this.#clicarNoMenu(this.seletores.linkExcluirConta)
  }

  validarLogadoComo(nome) {
    cy.get(this.seletores.menu)
      .contains('a', 'Logged in as')
      .find(this.seletores.nomeDoUsuario)
      .should('have.text', nome)
    return this
  }

  validarDeslogado() {
    cy.get(this.seletores.menu).find(this.seletores.linkLogout).should('not.exist')
    cy.get(this.seletores.menu).find(this.seletores.linkLogin).should('be.visible')
    return this
  }
}

module.exports = new Cabecalho()
