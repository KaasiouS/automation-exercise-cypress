// Pré-condições e limpeza via API pública do Automation Exercise (https://automationexercise.com/api_list).
// Atenção: a API sempre responde HTTP 200; o resultado real vem em `responseCode` no corpo.

// Hoje o corpo chega como texto (content-type text/html); se o site passar a enviar JSON, o Cypress já entrega o objeto
const corpoDaResposta = (response) => (typeof response.body === 'string' ? JSON.parse(response.body) : response.body)

Cypress.Commands.add('criarContaViaApi', (usuario) => {
  const { nascimento, endereco } = usuario

  cy.request({
    method: 'POST',
    url: '/api/createAccount',
    form: true,
    log: false, // o corpo contém a senha
    body: {
      name: usuario.nome,
      email: usuario.email,
      password: usuario.senha,
      title: usuario.titulo,
      birth_date: nascimento.dia,
      birth_month: nascimento.mes,
      birth_year: nascimento.ano,
      firstname: usuario.primeiroNome,
      lastname: usuario.sobrenome,
      company: endereco.empresa,
      address1: endereco.logradouro,
      address2: endereco.complemento,
      country: endereco.pais,
      state: endereco.estado,
      city: endereco.cidade,
      zipcode: endereco.cep,
      mobile_number: usuario.celular,
    },
  })
    .then(corpoDaResposta)
    // Compara o corpo inteiro: em caso de falha, o erro mostra o `message` da API, não só o código
    .should('deep.equal', { responseCode: 201, message: 'User created!' })
})

// Limpeza tolerante, feita no processo Node (task `excluirConta` em cypress.config.js).
// Diferente de cy.request, a task nunca lança erro: timeout ou falha de rede na limpeza
// não derrubam o hook afterEach (o que faria o Mocha pular os testes restantes da spec).
Cypress.Commands.add('excluirContaViaApi', (usuario) => {
  cy.task('excluirConta', { email: usuario.email, senha: usuario.senha }, { log: false }).then((resultado) => {
    Cypress.log({ name: 'limpeza', message: resultado })
  })
})
