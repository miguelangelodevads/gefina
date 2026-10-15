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

## Próxima etapa da aplicação

A API ainda lê `api/invoice.data.ts`. Criar e popular o banco não muda automaticamente a tabela mostrada pelo site. A leitura via PostgreSQL, consultas parametrizadas, teste de conectividade no health check e configuração do banco de produção pertencem à issue #15.

Quando a conexão for implementada, a string deve vir do ambiente, sem ser registrada no Git. Variáveis do frontend com prefixo `VITE_` são expostas ao navegador e não devem conter credenciais do banco.
