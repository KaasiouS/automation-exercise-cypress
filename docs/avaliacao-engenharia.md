# Avaliação de engenharia

Esta é uma revisão crítica do projeto em relação aos critérios do trabalho e a boas práticas de engenharia de software aplicadas a testes.
A abordagem foi 80/20: o esforço foi para o que mais pesa na avaliação e na manutenção (estabilidade, seletores, organização e feedback no CI).
O que ficou de fora está registrado no fim, com o motivo.

## Critérios do trabalho

| Critério | Como foi atendido | Situação |
|---|---|---|
| 1. Execução via GitHub Actions | `e2e.yml` com push, pull request e disparo manual; action oficial do Cypress; `concurrency` evita execuções paralelas da mesma branch; `timeout-minutes` evita job travado. Execuções em [Actions → E2E Cypress](https://github.com/KaasiouS/automation-exercise-cypress/actions/workflows/e2e.yml) | Atendido |
| 2. Execução sem quebras | 10/10 testes passando no GitHub Actions sem precisar de retry e localmente no Chrome (mesmo navegador do CI) com `--config retries=0`; nenhum `cy.wait` fixo; anúncios bloqueados; massa de dados nova a cada teste; limpeza via API | Atendido |
| 3. Seletores e padrões | `data-qa` → `id` → atributos estáveis; produtos pelo id, não pela posição; Page Object, Component Object, Data Builder e Facade | Atendido |
| 4. Boas práticas | `baseUrl`, config central, versões fixadas, `npm ci`, `.nvmrc`, `.gitignore`, testes independentes, dados sensíveis sem log | Atendido |
| 5. Relatórios | mochawesome com screenshots embutidos (inclusive das tentativas que falharam), testes instáveis marcados e seed do faker por teste; publicado como artefato mesmo em falha | Atendido |

## Princípios de engenharia observados

- **Responsabilidade única.** A spec descreve *o quê* (o Test Case); o Page Object sabe *como* interagir com a página; a factory sabe *quais dados* usar; a API cuida das pré-condições.
- **DRY sem exagero.** O trecho repetido do TC15 e do TC16 (carrinho → pagamento) é uma função local da spec, porque só faz sentido ali. Os fluxos usados por specs diferentes ficam no Facade. Os passos do TC1 continuam explícitos na spec, porque o cadastro é o próprio objeto do teste.
- **Isolamento.** Nenhum teste depende de outro nem de uma conta fixa no site. O `afterEach` garante a limpeza.
- **Fail fast e diagnóstico.** Cada ação é seguida de uma verificação do estado (URL, título, mensagem). Isso localiza a falha no passo certo.
- **Reprodutibilidade.** Dependências com versão exata e `package-lock.json`; Node fixado; o CI usa `npm ci`.
- **Segurança básica.** Senha e cartão são digitados com `{ log: false }`. Não há segredos no repositório e `.env*` está no `.gitignore`.

## Pontos de atenção (riscos conhecidos)

1. **Ambiente público e compartilhado.** O site pode ficar lento, mudar ou sair do ar. O retry de 1 tentativa no CI ameniza, mas não elimina, esse risco. Isso é inerente ao enunciado.
2. **Dados aleatórios.** O faker aumenta a variedade, mas uma falha pode depender do dado sorteado. O impacto foi reduzido com textos alfanuméricos onde o `cy.type` poderia interpretar caracteres especiais e com o país restrito às opções do `<select>`. A *seed* fica registrada no relatório e pode ser repetida com `--env FAKER_SEED=<seed>`.
3. **Desvio consciente das diretrizes de aula.** O guia de arquitetura da aula 6 sugeria módulos por funcionalidade, sem classes e sem "pages". Aqui foi adotado Page Object com classes, um padrão apresentado na aula 9 e considerado bônus. A troca está justificada no README e mantém os pontos centrais do guia: seletores próximos das ações, asserções nos objetos e nomes em português.
4. **Mensagem transitória do TC15/TC16.** O enunciado pede para verificar *"Your order has been placed successfully!"*, mas o site exibe essa mensagem só por um instante, antes de redirecionar. O teste verifica a confirmação estável da página seguinte (*"Order Placed!"* e *"Congratulations! Your order has been confirmed!"*), que comprova o mesmo resultado sem depender de tempo.
5. **Pedidos reais no site.** O TC15 e o TC16 geram pedidos no ambiente de demonstração. A conta é excluída ao final, mas o pedido em si não tem API de limpeza.

## Fora do escopo (por decisão 80/20)

| Item | Por que ficou de fora |
|---|---|
| ESLint/Prettier e hook de pré-commit | É uma boa prática, mas não é critério de avaliação. Seria o próximo passo para um time. |
| Tags com `@cypress/grep` (smoke/regressão) | Com 10 testes e menos de 3 minutos de execução, separar não traz ganho. |
| Matriz de navegadores ou BrowserStack | Não é exigido. O foco é a validação funcional em um navegador (Chrome). |
| `cy.session` para login | Os cenários de login são o próprio objeto do teste e precisam passar pela interface. |
| Publicação do relatório no GitHub Pages | O artefato do Actions já atende ao critério de relatório. |
| XPath | Não é exigido (era ponto extra com prazo encerrado). |

## Conclusão

Sim, o projeto está dentro de um contexto de engenharia de software com boas práticas, na medida certa para o tamanho da suíte:
o código tem camadas claras, os testes são independentes e reproduzíveis, os seletores são resilientes, há CI com relatório e as decisões estão documentadas.
Os itens pendentes (lint, tags) são incrementais e não comprometem a entrega.
