# Banco de dados: preparação

O projeto possui um modelo lógico em `docs/data-model.md`, um roteiro de criação das tabelas em `api/database/schema.sql` e um roteiro de dados fictícios em `api/database/seed.sql`.

## Ambientes

No Neon, use branches separadas: `development` para exercícios e `production` para o ambiente publicado. Confirme a branch e o banco selecionados no SQL Editor antes de executar qualquer roteiro.

O arquivo `schema.sql` cria as tabelas `users`, `sessions`, `customers` e `invoices`. Execute uma vez em um banco vazio. Se as tabelas já existem, confira sua estrutura antes de tentar recriá-las.

O arquivo `seed.sql` é destinado exclusivamente ao desenvolvimento. Ele começa com `TRUNCATE` e reinicia os identificadores: todos os registros das quatro tabelas são substituídos. Não execute em produção ou em um banco com dados que deseja preservar.

## Dados fictícios

Depois da criação das tabelas, o seed produz:

- 5 usuários;
- 24 clientes, dos quais 4 sem faturas;
- 180 faturas: 81 pagas, 63 pendentes com vencimento futuro e 36 pendentes vencidas.

As datas são relativas a `CURRENT_DATE`. Reexecutar no mesmo dia recria os mesmos registros; em outro dia as datas acompanham o calendário. O campo `password_hash` contém `placeholder`: esses usuários são dados de teste e não possuem credenciais de autenticação utilizáveis.

## Conferência

No SQL Editor da branch de desenvolvimento:

```sql
SELECT 'users' AS tabela, COUNT(*) AS quantidade FROM users
UNION ALL SELECT 'customers', COUNT(*) FROM customers
UNION ALL SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL SELECT 'sessions', COUNT(*) FROM sessions;

SELECT status, COUNT(*) FROM invoices GROUP BY status;

SELECT COUNT(*) AS vencidas
FROM invoices
WHERE status = 'pending' AND due_date < CURRENT_DATE;
```

## Conectar a API

A API consulta PostgreSQL por meio de `pg`, instalado no pacote `api/`. As consultas ficam em `api/invoice.service.ts`; as rotas aguardam seus resultados com `async/await`.

Para desenvolvimento, copie `api/.env.example` para `api/.env` e preencha `DATABASE_URL` com a conexão da branch `development`. Preserve os parâmetros SSL fornecidos pelo Neon. A variável é carregada pelo comando `npm run dev` executado em `api/`.

O arquivo `.env` é ignorado pelo Git. Nunca coloque credenciais em variáveis `VITE_`, pois elas são expostas ao navegador.

## Preparar a publicação

No banco vazio da branch `production`, execute `schema.sql` e depois `initial-data.sql`. Esse segundo roteiro insere as três faturas demonstrativas da versão anterior, sem apagar dados. Deve ser executado uma única vez em banco vazio; não reutilize em um banco já populado.

O seed de 180 faturas continua exclusivo do desenvolvimento. Os usuários demonstrativos usam `placeholder` em `password_hash`; não são credenciais válidas de autenticação.

No serviço `gefina` do Render, configure `DATABASE_URL` com a conexão da branch `production`, mantendo os parâmetros SSL. O comando `npm start` usa as variáveis fornecidas pela hospedagem e não lê `.env`.

A aplicação requer essa variável para iniciar. Configure e confira o banco antes de integrar o PR que ativa a conexão, pois um push na `main` dispara a publicação automática.

## Endpoints para conferir

- `/api/health`: responde 200 com `status: ok` e o nome do banco quando uma consulta funciona; responde 503 se o banco estiver indisponível.
- `/api/invoices`: retorna a lista ordenada por emissão decrescente e ID decrescente em caso de empate.
- `/api/invoices/1`: consulta parametrizada por ID.
- `/api/invoices/999999`: responde 404 para um ID sem registro.
- `/api/invoices/abc`: responde 400 para identificador inválido.

As datas continuam no formato `YYYY-MM-DD`, sem horário, para manter o contrato da interface. Falhas inesperadas nas consultas recebem uma resposta JSON genérica, sem detalhes de conexão.
