# Aula: testes automatizados das rotas da API

Alinhamento de 10 de novembro de 2026. Referência da aula: `3c136ea`.

## O que o professor acrescentou

- `api/app.ts`: monta o Express, os middlewares e as rotas, e exporta a aplicação.
- `api/server.ts`: importa a aplicação e abre a porta do servidor.
- Vitest: executa os testes e informa quais passaram ou falharam.
- Supertest: envia requisições HTTP para o Express durante os testes.
- `api/invoice.test.ts`: verifica listagem, criação, edição, exclusão e erros.
- Na raiz, `npm run test:api` executa os testes da API.

Separar os arquivos permite importar a aplicação nos testes sem iniciar o servidor
na porta 3000. O comando normal de desenvolvimento e a publicação continuam usando
`server.ts`.

## Como executar a aula no seu computador

Na pasta do Gefina:

```sh
npm ci --prefix api
docker compose -p gefina-aula-tests -f api/compose.test.yaml up -d --wait
npm run test:api
docker compose -p gefina-aula-tests -f api/compose.test.yaml down
```

É necessário ter Docker com Compose disponível. A primeira execução baixa a imagem
do PostgreSQL 17. O banco de testes usa apenas `127.0.0.1:55432`, se chama
`gefina_test` e recebe as tabelas de `api/database/schema.sql` automaticamente.
Os dados ficam em memória e são descartados ao remover o contêiner.

`api/test.setup.ts` usa essa conexão local por padrão. Se precisar ajustar a porta,
crie um arquivo local `api/.env.test` com `TEST_DATABASE_URL`. O endereço deve ser
local e o nome do banco deve terminar em `_test`. O executor não carrega seu
`.env` de desenvolvimento nem reutiliza a variável `DATABASE_URL` da produção.

Exemplo para o banco temporário da aula:

```dotenv
TEST_DATABASE_URL=postgresql://gefina:gefina_test@127.0.0.1:55432/gefina_test
```

Esses dados são exclusivos do contêiner de testes. Não substitua as variáveis do
Neon ou do Render por essa configuração.

## Entendendo um teste

```ts
it('devolve a relação de faturas', async () => {
  const response = await request.get('/api/invoices');
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});
```

`it` descreve um comportamento esperado. `request.get` faz a requisição. `expect`
compara o resultado real com o esperado. Se a comparação falhar, o executor aponta
o teste e a diferença.

Nos testes de criação e edição, `.send(...)` representa o corpo JSON enviado pelo
formulário. As verificações conferem o código HTTP e os dados retornados.

## Preparação e limpeza

- `beforeAll`: cria um usuário fictício para a suíte funcionar até em banco vazio.
- `beforeEach`: limpa os registros fictícios e prepara um cliente e uma fatura.
- `afterAll`: remove os registros da suíte e encerra a conexão com o banco.

Cada teste começa com uma base conhecida. Assim, o resultado não depende de ter
clicado antes no formulário ou de outra pessoa ter criado uma fatura.

Os nove testes de integração exercitam o Express e um PostgreSQL real, temporário.
Os dezessete testes de validação anteriores continuam separados e usam consultas
simuladas. O comando principal executa os dois grupos: 26 testes ao todo.

Para rodar apenas a validação, sem Docker:

```sh
npm run test:validation --prefix api
```

Para acompanhar alterações automaticamente, com o banco de testes ligado:

```sh
npm run test:watch --prefix api
```

## Exercício para aprender sozinho

Abra `api/invoice.test.ts`, encontre o teste que recusa valor zero e observe a
resposta HTTP 400 e `error.fields.amount`. Depois escreva um teste parecido para
um valor negativo. Execute novamente e leia o resultado.

O alinhamento mantém as configurações de publicação, o banco Neon e os testes de
validação da aula anterior. O isolamento local evita executar as rotinas de
limpeza da suíte nos dados usados pelo site publicado.
