# Gefina

Sistema de gestão de contas a receber.

O Gefina registra os clientes de uma organização e as faturas emitidas contra esses clientes, e apresenta a visão consolidada da situação financeira que desses registros decorre.

## Funcionalidades

- Cadastro e manutenção de clientes
- Emissão e manutenção de faturas
- Listagens com busca, ordenação e paginação
- Painel de indicadores consolidados
- Acesso autenticado e administração de contas

## Fora do escopo

- Cadastro público de usuários
- Recuperação de senha
- Envio de arquivo de imagem
- Representação gráfica de séries temporais

---

Acesse: https://gefina-ppqd.onrender.com

## Publicação no Render

Crie um **Web Service** conectado a este repositório, na branch `main`.

- Runtime: Node
- Root Directory: deixe vazio
- Build Command: `npm run build`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Instance Type: Free

O arquivo `.node-version` fixa Node 24.20.0, que permite executar os arquivos TypeScript da API diretamente. O build instala as dependências de `api/` e `web/` e gera `web/dist`. O Express serve tanto a interface quanto as rotas `/api`. A porta é fornecida pelo Render na variável `PORT`.

## Banco de dados

Veja [a preparação dos ambientes e os roteiros SQL](docs/database-setup.md). A API consulta PostgreSQL usando `DATABASE_URL`. Configure essa variável antes de iniciar ou publicar a aplicação.

## Testes da API

Consulte [a aula de testes automatizados](docs/aula-testes-api.md) para preparar
um PostgreSQL temporário local e executar `npm run test:api` com Vitest e Supertest.
Os testes não usam o Neon de desenvolvimento ou produção. A validação sem banco
pode ser executada com `npm run test:validation --prefix api`.

## Aulas atualizadas em 24/11/2026

Comece pelo [roteiro das aulas](docs/roteiro-aulas.md) e pela
[arquitetura atual](docs/aula-arquitetura.md). Os serviços já utilizam Prisma,
a interface usa Tailwind e os arquivos estão organizados por responsabilidade.
O [comparativo](docs/comparacao-alinhamento.md) registra as diferenças intencionais.

Execute `npm run test:api` com o PostgreSQL local descartável ligado e
`npm run test:web` para os sete testes do formulário. O build da API gera o cliente
Prisma sem executar migração ou carga de dados no banco existente.
