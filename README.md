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
