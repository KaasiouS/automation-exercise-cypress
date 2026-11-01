// Páginas /checkout (endereço + revisão) e /payment (pagamento + confirmação)
class CheckoutPage {
  seletores = {
    enderecoEntrega: '#address_delivery',
    enderecoCobranca: '#address_invoice',
    linhas: '#cart_info tbody tr[id^="product-"]',
    comentario: 'textarea[name="message"]',
    botaoFazerPedido: 'a[href="/payment"]',
    nomeNoCartao: '[data-qa="name-on-card"]',
    numeroCartao: '[data-qa="card-number"]',
    cvc: '[data-qa="cvc"]',
    mesValidade: '[data-qa="expiry-month"]',
    anoValidade: '[data-qa="expiry-year"]',
    botaoPagar: '[data-qa="pay-button"]',
    pedidoConfirmado: '[data-qa="order-placed"]',
  }

  // Entrega e cobrança devem refletir o endereço informado no cadastro
  validarEndereco(usuario) {
    const { endereco } = usuario
    cy.location('pathname').should('eq', '/checkout')
    cy.contains('h2', 'Address Details').should('be.visible')

    const blocos = [this.seletores.enderecoEntrega, this.seletores.enderecoCobranca]
    blocos.forEach((bloco) => {
      cy.get(bloco)
        .should('contain.text', `${usuario.primeiroNome} ${usuario.sobrenome}`)
        .and('contain.text', endereco.empresa)
        .and('contain.text', endereco.logradouro)
        .and('contain.text', endereco.complemento)
        .and('contain.text', endereco.cidade)
        .and('contain.text', endereco.estado)
        .and('contain.text', endereco.cep)
        .and('contain.text', endereco.pais)
        .and('contain.text', usuario.celular)
    })
    return this
  }

  validarRevisaoDoPedido(quantidadeDeItens) {
    cy.contains('h2', 'Review Your Order').should('be.visible')
    cy.get(this.seletores.linhas).should('have.length', quantidadeDeItens)
    return this
  }

  fazerPedido(comentario) {
    cy.get(this.seletores.comentario).type(comentario)
    cy.get(this.seletores.botaoFazerPedido).click()
    return this
  }

  pagar(cartao) {
    cy.location('pathname').should('eq', '/payment')
    cy.get(this.seletores.nomeNoCartao).type(cartao.nomeImpresso)
    cy.get(this.seletores.numeroCartao).type(cartao.numero, { log: false })
    cy.get(this.seletores.cvc).type(cartao.cvc, { log: false })
    cy.get(this.seletores.mesValidade).type(cartao.mesValidade)
    cy.get(this.seletores.anoValidade).type(cartao.anoValidade)
    cy.get(this.seletores.botaoPagar).click()
    return this
  }

  validarPedidoConfirmado() {
    cy.location('pathname').should('match', /^\/payment_done/)
    cy.get(this.seletores.pedidoConfirmado).should('be.visible').and('have.text', 'Order Placed!')
    cy.contains('p', 'Congratulations! Your order has been confirmed!').should('be.visible')
    return this
  }
}

module.exports = new CheckoutPage()
