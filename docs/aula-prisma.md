# Aula: primeiros passos com Prisma

## Onde a turma chegou

Comparação realizada em 10/11/2026: a main do professor está em `3c136ea`.
A novidade está na branch `refactor/database-access`, commit `db53682`.
Ela adiciona Prisma 6.19.3, o modelo de dados e uma migração inicial.
A conversão dos serviços ainda está em andamento: somente a listagem foi implementada,
e seis funções de faturas estão vazias. Não publicar essa versão incompleta.

Sua branch de estudo tem o modelo e a migração do professor, mas conserva os serviços
SQL funcionais. A main e o site publicado continuam na etapa anterior.

## 1. Entenda a mudança

Até agora o serviço escreve SQL e envia as consultas usando `pg`.
Prisma é um mapeador objeto-relacional: ele permite expressar consultas por métodos
como `prisma.invoice.findMany()`. O PostgreSQL continua sendo o banco.
Não é necessário criar outro projeto no Neon para estudar esse conceito.

## 2. Leia os arquivos nesta ordem

1. `api/prisma/schema.prisma`: declara User, Session, Customer e Invoice.
2. `api/prisma/migrations/20261110134318_init/migration.sql`: SQL gerado para criar as tabelas.
3. `api/prisma.ts`: cria o cliente que poderá executar consultas.
4. `api/invoice.service.ts`: serviço atual, ainda em SQL, para comparar os dois estilos.

`@map("customer_id")` liga o nome customerId do código à coluna customer_id.
`@@map("invoices")` liga o modelo Invoice à tabela invoices.
A relação customer permite buscar a fatura junto com seu cliente.

## 3. Prepare o cliente sem alterar o banco

Na pasta do projeto:

```sh
npm ci --prefix api
cd api
npx prisma generate
DATABASE_URL=postgresql://gefina:gefina_test@127.0.0.1:55432/gefina_test npx prisma validate
cd ..
```

Gerar o cliente e validar o modelo não cria tabelas e não insere registros.
A URL acima é do banco local descartável de testes.

## 4. Entenda a primeira consulta

```ts
const records = await prisma.invoice.findMany({
  include: { customer: true },
  orderBy: { createdAt: 'desc' },
});
```

Isso busca faturas, inclui os clientes relacionados e ordena da mais recente.
Datas retornam como objetos Date: a API precisa convertê-las novamente para
YYYY-MM-DD. Preserve também a regra de vencimento: vence hoje não significa atrasada.

## 5. Migração não é um comando para executar sem conferir

Seu Neon já tem as tabelas. A migração inicial contém CREATE TABLE e falhará
se for aplicada diretamente nesse banco existente. Antes de adotar migrações,
é preciso comparar a estrutura real e registrar uma linha de base compatível.
Não execute migrate reset, db push ou a migração inicial no Neon nesta aula.
O schema.sql foi mantido porque o banco de testes atual ainda o utiliza.

## 6. Verifique a versão funcional

```sh
docker compose -p gefina-aula-tests -f api/compose.test.yaml up -d --wait
npm run test:api
npm run check --prefix api
npm run check --prefix web
docker compose -p gefina-aula-tests -f api/compose.test.yaml down
```

## Exercício para a próxima etapa

Em uma branch de exercício, converta primeiro findAllInvoices. Depois implemente
busca por ID, recentes, atrasadas, inserção, alteração e remoção. Rode os testes
após cada função. Será necessário adaptar os testes que simulam pool.query,
encerrar o cliente Prisma nos testes e preservar os erros de registro inexistente
ou cliente inválido. Só publique quando todas as rotas continuarem funcionando.
