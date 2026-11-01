# Automation Exercise — Testes E2E com Cypress

[![E2E Cypress](https://github.com/KaasiouS/automation-exercise-cypress/actions/workflows/e2e.yml/badge.svg)](https://github.com/KaasiouS/automation-exercise-cypress/actions/workflows/e2e.yml)

Trabalho de conclusão da disciplina **Automação de Testes na Camada de Interface (Web)** — PGATS.
O projeto automatiza os casos de teste **1, 2, 3, 4, 5, 8, 9, 10, 15 e 16** da página
[Test Cases](https://automationexercise.com/test_cases) do site [Automation Exercise](https://automationexercise.com).

## Cobertura

| Spec | Caso | Cenário |
|---|---|---|
| `autenticacao.cy.js` | TC1 | Cadastrar usuário |
| | TC2 | Login com e-mail e senha corretos |
| | TC3 | Login com e-mail e senha incorretos |
| | TC4 | Logout de usuário |
| | TC5 | Cadastrar usuário com e-mail já existente |
| `produtos.cy.js` | TC8 | Verificar todos os produtos e o detalhe de um produto |
| | TC9 | Pesquisar produto |
| `newsletter.cy.js` | TC10 | Verificar assinatura da newsletter na home |
| `checkout.cy.js` | TC15 | Fazer pedido: cadastrar antes do checkout |
| | TC16 | Fazer pedido: login antes do checkout |

## Como executar

Requisitos: **Node.js 22+** (versão fixada em `.nvmrc`).

```bash
npm ci            # instala as dependências pelo package-lock
npm run cy:open   # modo interativo
npm test          # headless no Chrome (o mesmo navegador do CI): roda todas as specs e gera o relatório
npm run test:electron   # alternativa sem Chrome instalado (Electron, embutido no Cypress)
```

Se o binário do Cypress não for baixado na instalação (por exemplo, com scripts de instalação desabilitados no npm), rode `npx cypress install`.

### Reproduzir uma falha causada pelo dado sorteado

Os dados vêm do faker com uma *seed* aleatória, registrada no relatório de cada teste (`FAKER_SEED=...`).
Para repetir exatamente os mesmos dados:

```bash
npx cypress run --browser chrome --spec cypress/e2e/checkout.cy.js --env FAKER_SEED=123456
```

## Relatório

O [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) gera um HTML único,
com gráficos e screenshots das falhas embutidos, em `cypress/reports/index.html`.
Um teste que só passou no retry aparece marcado como **INSTÁVEL**, com o screenshot da tentativa que falhou.
No GitHub Actions, o relatório é publicado como artefato **relatorio-e2e** em toda execução, inclusive quando há falha.

## Integração contínua

O workflow [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml) roda a cada push na `main`, em pull requests
e manualmente (*Actions → E2E Cypress → Run workflow*). Ele usa a action oficial `cypress-io/github-action`,
que instala as dependências com cache do binário do Cypress e executa a suíte no Chrome.

## Arquitetura

```
cypress/
├── e2e/                    # uma spec por funcionalidade; cada `it` = um Test Case
├── fixtures/cartao.json    # dados estáticos de pagamento
└── support/
    ├── e2e.js              # carrega o reporter e os comandos
    ├── api/conta.js        # cy.criarContaViaApi / cy.excluirContaViaApi
    ├── factories/usuario.js# Data Builder com faker: usuário novo a cada teste
    ├── components/         # Component Objects: cabeçalho, rodapé, vitrine de produtos
    ├── pages/              # Page Objects: home, login, cadastro, produtos, carrinho, checkout
    └── fluxos.js           # Facade: cadastrar, entrar e excluir conta pela interface
```

### Decisões

- **Page Object + Component Object.** Cada página guarda seus seletores e expõe ações e verificações com nomes de negócio.
  Cabeçalho, rodapé e grade de produtos aparecem em várias páginas, por isso são componentes à parte.
  Os métodos retornam `this`, o que permite encadear passos (`loginPage.validarCarregada().entrar(...)`).
- **Seletores.** A ordem de preferência é `data-qa` → `id` → atributos estáveis (`href`, `data-product-id`, `name`).
  Os produtos são escolhidos pelo id, não pela ordem na tela (o `.first()` só aparece onde a ordem é irrelevante,
  como "há ao menos um produto visível").
  Quando a página repete um elemento (a home tem a grade principal e o carrossel "Recommended Items"), o seletor é limitado à região correta.
- **Testes independentes.** Cada teste gera um usuário novo pelo Data Builder.
  Quando o cenário só precisa de uma conta existente (TC2, TC4, TC5 e TC16), ela é criada pela **API** do site:
  o pré-requisito fica fora do foco do teste e a execução é mais rápida.
  Um `afterEach` exclui a conta pela API, mesmo que o teste tenha falhado no meio. A exclusão roda numa task do Node
  que nunca lança erro: uma falha de rede na limpeza não derruba o hook (o que faria o Mocha pular o restante da spec).
- **Asserções pela intenção.** Cada passo verifica o estado esperado (URL, título da seção, mensagem) antes da próxima ação.
  Uma falha aponta onde o fluxo quebrou, e não só o sintoma "elemento não encontrado".
- **Estabilidade.** `baseUrl` centralizado, bloqueio dos domínios de anúncio (que abrem vinhetas sobre a página),
  nenhuma espera fixa (`cy.wait`) e 1 nova tentativa automática apenas no modo headless, sempre visível no relatório.
- **Comandos customizados só para o genérico.** As chamadas de API viraram `cy.*`. O resto fica nos Page Objects.

Mais detalhes sobre as escolhas e os pontos de melhoria estão em [`docs/avaliacao-engenharia.md`](docs/avaliacao-engenharia.md).
