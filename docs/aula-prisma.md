# Aula: primeiros passos com Prisma

## Onde a turma chegou

Comparação atualizada em **17/11/2026**. O professor concluiu a conversão
para Prisma na main `f9ead51`, por meio do PR #36. Faturas, clientes e painel
já utilizam o cliente Prisma. Também foram adicionados seed e migrate:deploy.
A informação da aula anterior sobre seis funções vazias descrevia a etapa de
10/11; essas funções já foram implementadas na referência atual.

No seu projeto, a branch `refactor/database-access` ainda é preparatória:
tem o modelo e o cliente, mas conserva os serviços SQL funcionais. Esta atualização
é do material de estudo; não converte os serviços nem altera Neon ou Render.
Consulte [o roteiro atualizado](roteiro-aulas.md) e a continuação abaixo.

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

## 7. Continuação: serviços completos na referência atual

O professor substituiu as consultas SQL por estas operações:

| Necessidade | Método Prisma |
| --- | --- |
| Listar faturas | invoice.findMany |
| Encontrar uma fatura | invoice.findUnique |
| Cinco recentes | findMany com orderBy e take: 5 |
| Cinco atrasadas | findMany com where, orderBy e take |
| Criar | invoice.create |
| Alterar | invoice.update |
| Excluir | invoice.delete |
| Somar valores por situação | invoice.aggregate com _sum |
| Contar faturas e clientes | invoice.count e customer.count |

Exemplo de busca por identificador:

```ts
const record = await prisma.invoice.findUnique({
  where: { id: 1 },
  include: { customer: true },
});
```

`where` escolhe o registro; `include` traz o cliente relacionado. Se não encontrar,
findUnique devolve null. A camada de serviço pode convertê-lo para undefined,
e a rota deve responder 404 e encerrar seu processamento.

Exemplo de soma, em centavos:

```ts
const result = await prisma.invoice.aggregate({
  where: { status: 'paid' },
  _sum: { amount: true },
});
const total = result._sum.amount ?? 0;
```

Sem faturas, a soma pode ser null. O operador ?? fornece zero nesse caso.
A interface converte os centavos para reais; não divida antes de armazenar.

Ao estudar a implementação do professor, confira também as regras: a comparação
`dueDate < new Date()` considera o horário atual. Uma coluna DATE representa um dia,
então a regra “vence hoje” precisa ser testada explicitamente. Mudar a ferramenta
de acesso não deve mudar o significado de atraso.

## 8. Cliente, migração e seed têm funções diferentes

| Operação | O que faz | Modifica dados ou estrutura? |
| --- | --- | --- |
| prisma generate | Gera o código do cliente | Não modifica o banco |
| prisma validate | Confere o modelo | Não modifica o banco |
| prisma migrate deploy | Aplica migrações pendentes | Sim, modifica estrutura |
| seed.ts | Executa o programa de carga | Sim, modifica registros |

Na referência atual, postinstall executa prisma generate; migrate:deploy executa
prisma migrate deploy; seed executa node --env-file=.env ./prisma/seed.ts.
Esses scripts novos ainda não foram incorporados ao package.json da sua branch.

O seed do professor executa **TRUNCATE users, sessions, customers, invoices
RESTART IDENTITY** dentro de uma transação, antes de inserir dados fictícios.
Ele substitui a base, incluindo usuários e sessões; não é apenas uma inserção.
Não o execute no seu Neon de desenvolvimento ou produção para acompanhar a aula.
Uma transação permite desfazer tudo em caso de erro, mas, se concluir, a limpeza
é confirmada. Use uma base local exclusiva e descartável para esse exercício.

## 9. Sequência de estudo antes de publicar Prisma

1. Entenda e valide schema.prisma, sem acessar dados.
2. Pratique uma consulta de leitura em um banco local.
3. Converta cada serviço e adapte os testes que simulam pool.query.
4. Verifique os códigos HTTP, a validação do PUT e as regras de datas.
5. Confirme que o cliente Prisma é gerado em uma instalação limpa.
6. Planeje a linha de base das migrações para as tabelas já existentes.
7. Só depois prepare a publicação e a aplicação das migrações adequadas.

Pergunta para conferir o entendimento: por que executar generate não cria as
tabelas, enquanto executar uma migração pode criá-las? Explique com suas palavras
antes de seguir para os testes de interface.
