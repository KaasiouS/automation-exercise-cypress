// Data Builder: cada chamada gera um usuário novo e válido para o formulário do site.
// Os testes ficam independentes entre si e entre execuções (sem e-mail repetido).
const { faker } = require('@faker-js/faker')

// Seed do faker: aleatória por padrão, ou fixa para reproduzir uma falha causada pelo dado sorteado:
//   npx cypress run --spec <spec> --env FAKER_SEED=<seed do relatório>
// O e-mail continua único mesmo com seed fixa, porque inclui o Date.now().
const SEED = Number(Cypress.env('FAKER_SEED')) || Math.floor(Math.random() * 1e9)
faker.seed(SEED)

// Registra a seed no relatório (mochawesome) e no log de comandos de cada teste da spec
beforeEach(() => {
  cy.addTestContext(`FAKER_SEED=${SEED}`)
  cy.log(`FAKER_SEED=${SEED}`)
})

// Únicos países aceitos pelo <select> de cadastro
const PAISES_DISPONIVEIS = ['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']

// Só letras e números: `{` e `}` seriam interpretados como teclas especiais pelo cy.type()
const textoSeguro = (tamanho) => faker.string.alphanumeric(tamanho)

function emailUnico(prefixo = 'qa') {
  return `${prefixo}.${Date.now()}.${textoSeguro(5).toLowerCase()}@teste.dev`
}

function novoUsuario(sobrescritas = {}) {
  const primeiroNome = faker.person.firstName()
  const sobrenome = faker.person.lastName()
  const dataNascimento = faker.date.birthdate({ min: 18, max: 65, mode: 'age' })

  return {
    nome: `${primeiroNome} ${sobrenome}`,
    primeiroNome,
    sobrenome,
    email: emailUnico(),
    senha: `${textoSeguro(10)}@1`,
    titulo: faker.helpers.arrayElement(['Mr', 'Mrs']),
    nascimento: {
      dia: String(dataNascimento.getDate()),
      mes: String(dataNascimento.getMonth() + 1),
      ano: String(dataNascimento.getFullYear()),
    },
    endereco: {
      empresa: faker.company.name(),
      logradouro: faker.location.streetAddress(),
      complemento: faker.location.secondaryAddress(),
      pais: faker.helpers.arrayElement(PAISES_DISPONIVEIS),
      estado: faker.location.state(),
      cidade: faker.location.city(),
      cep: faker.location.zipCode('#####'),
    },
    celular: faker.string.numeric(11),
    ...sobrescritas,
  }
}

module.exports = { novoUsuario, emailUnico }
