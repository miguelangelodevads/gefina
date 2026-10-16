-- Dados demonstrativos iniciais, equivalentes às três faturas da versão anterior.
-- Execute uma vez, somente após o schema em um banco vazio.
-- Não apaga nem substitui registros existentes.
BEGIN;

INSERT INTO users (name, email, password_hash, role)
VALUES ('Usuário de demonstração', 'demo@gefina.example', 'placeholder', 'admin');

INSERT INTO customers (user_id, name, email) VALUES
  (1, 'Construtora Meridiano', 'contato@meridiano.com.br'),
  (1, 'Gráfica Aurora', 'contato@graficaaurora.com.br');

INSERT INTO invoices (customer_id, amount, status, issue_date, due_date) VALUES
  (1, 125000, 'pending', '2026-06-01', '2026-06-15'),
  (1, 348000, 'paid', '2026-05-12', '2026-06-11'),
  (2, 96500, 'pending', '2026-06-20', '2026-07-20');

COMMIT;
