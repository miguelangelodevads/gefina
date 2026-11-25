# Aula: a organização atual do Gefina

Referência conferida em 24/11/2026: main do professor b6746b8.
Ele mesclou a organização por camadas no PR #43 e corrigiu o caminho do build web.
Esta etapa e os serviços Prisma estão incorporados ao seu projeto.

## Comece pelo caminho de uma fatura

1. web/src/components/InvoiceForm.tsx mostra o formulário e converte reais em centavos.
2. web/src/components/InvoicePage.tsx coordena salvar, editar e excluir.
3. web/src/requests/invoiceApi.ts envia a requisição HTTP.
4. api/src/routes/invoice.route.ts recebe a requisição e valida os dados.
5. api/src/schemas/invoice.schema.ts define os dados aceitos pelo Zod.
6. api/src/services/invoice.service.ts usa Prisma para acessar o PostgreSQL.
7. api/src/prisma.ts mantém o cliente Prisma utilizado pelos serviços.
8. A resposta volta para a página, que atualiza a lista.

Mover um arquivo exige corrigir seus imports: um componente agora usa
../types/invoiceType.ts, pois os tipos estão em uma pasta irmã.

## O que cada pasta contém

| Pasta | Responsabilidade |
| --- | --- |
| api/src/routes | Métodos e respostas HTTP |
| api/src/schemas | Regras de entrada e mensagens de validação |
| api/src/services | Consultas e operações de negócio |
| api/src/tests | Testes de integração e validação |
| api/prisma | Modelo, migrações e carga demonstrativa |
| web/src/components | Interface React |
| web/src/requests | Chamadas HTTP da interface |
| web/src/types | Tipos de dados compartilhados pela interface |
| web/src/tests | Testes dos componentes |

A referência usa um middleware de erro em pasta separada. Neste projeto, o
tratamento continua centralizado em app.ts para conservar a omissão de credenciais
nos logs e o mapeamento dos erros Prisma para respostas 400/404.
api/src/database.ts foi mantido exclusivamente como conexão pg para preparar e
limpar dados nos testes. Os serviços e o health check utilizam Prisma.

## Por que app.ts e server.ts continuam separados?

app.ts monta as rotas e exporta o Express sem abrir uma porta fixa. Os testes podem
importá-lo. server.ts chama listen e usa PORT do ambiente. Como app.ts agora está
em api/src, é preciso subir dois níveis para encontrar web/dist. Esse detalhe
foi corrigido no último commit do professor e está considerado nesta atualização.

## Execute em desenvolvimento

Na raiz:

```sh
npm ci --prefix api
npm ci --prefix web
```

Configure api/.env localmente com DATABASE_URL do seu ambiente de desenvolvimento.
Não compartilhe o conteúdo desse arquivo. Em dois terminais separados:

```sh
npm run dev --prefix api
```

```sh
npm run dev --prefix web
```

O Vite encaminha /api para localhost:3000. O postinstall da API gera o cliente
Prisma. Gerar o cliente não aplica migração e não insere dados.

## Verifique sem acessar Neon

```sh
docker compose -p gefina-aula-tests -f api/compose.test.yaml up -d --wait
npm run test:api
npm run test:web
npm run check --prefix api
npm run check --prefix web
npm run build
docker compose -p gefina-aula-tests -f api/compose.test.yaml down
```

São 14 testes HTTP com banco local, 17 testes de validação e 7 do formulário:
38 testes ao todo. Os dados fictícios da suíte são removidos ao finalizar.

## Migração e carga de dados

migrate:deploy aplica migrações ainda não registradas; não é executado pelo build.
O Neon existente já possui tabelas, então não aplique a migração inicial sem
comparar o esquema e planejar a linha de base. Nenhuma migração no Neon foi
executada nesta atualização.

O seed substitui todos os registros das quatro tabelas. Aqui ele só aceita uma
base local terminada em _test. Foi acrescentado para acompanhar a aula, sem
executá-lo em desenvolvimento remoto ou produção.

Exercício: escolha a ação Salvar e explique, apontando os arquivos, como um valor
chega do campo Valor até invoice.create e volta para a interface.
