const { defineConfig } = require('cypress')

// Domínios de anúncio do site: abrem vinhetas/pop-ups que cobrem a tela e geram falhas intermitentes
const HOSTS_DE_ANUNCIO = [
  '*googlesyndication.com',
  '*doubleclick.net',
  '*googleadservices.com',
  '*google-analytics.com',
  '*googletagmanager.com',
  '*adtrafficquality.google',
  '*fundingchoicesmessages.google.com',
]

// Exclui a conta pela API sem nunca lançar erro: a limpeza não pode reprovar nem interromper a suíte
async function excluirConta(baseUrl, { email, senha }) {
  try {
    const resposta = await fetch(`${baseUrl}/api/deleteAccount`, {
      method: 'DELETE',
      body: new URLSearchParams({ email, password: senha }),
      signal: AbortSignal.timeout(15000),
    })
    const { responseCode, message } = JSON.parse(await resposta.text())
    return `${responseCode} - ${message}`
  } catch (erro) {
    return `falhou (ignorado): ${erro.message}`
  }
}

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 800,
  defaultCommandTimeout: 10000,
  watchForFileChanges: false,
  blockHosts: HOSTS_DE_ANUNCIO,
  // O site é público e compartilhado: 1 nova tentativa no modo headless absorve oscilação de rede.
  // Para o teste instável não passar despercebido: saveAllAttempts embute no relatório o screenshot da tentativa
  // que falhou, e o support/e2e.js marca o teste como INSTÁVEL quando ele precisou de retry.
  retries: { runMode: 1, openMode: 0 },
  video: false,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'Automation Exercise — Relatório E2E',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
  },
  e2e: {
    baseUrl: 'https://automationexercise.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      on('task', {
        excluirConta: (credenciais) => excluirConta(config.baseUrl, credenciais),
      })
      return config
    },
  },
})
