# Comparação do alinhamento em 24/11/2026

Referência: main do professor b6746b8. As principais etapas foram incorporadas:

- Serviços de faturas, clientes e painel usando Prisma.
- Scripts postinstall, seed e migrate:deploy na API.
- Organização api/src em routes, schemas, services e tests.
- Organização web/src em components, requests, types e tests.
- Componentes convertidos para Tailwind e remoção do CSS anterior.
- Sete testes do formulário e ajustes dos imports nos diretórios novos.
- Caminho web/dist corrigido na aplicação Express dentro de api/src.

## Diferenças intencionais

- Validação de edição e identificadores, acessibilidade e erros de campo preservados.
- Erros Prisma de cliente inválido e registro ausente viram 400/404.
- Vencimento é comparado por dia UTC: fatura que vence hoje continua pendente.
- Ordenações incluem ID para desempate estável.
- Health check usa Prisma e mantém a resposta status/database já utilizada.
- Tratamento e omissão de credenciais nos logs seguem centralizados em app.ts.
- Os testes só aceitam PostgreSQL local com nome terminado em _test.
- pg é mantido para preparar/limpar os dados dos testes; os serviços usam Prisma.
- Seed só pode executar em base local terminada em _test. Não foi executado no Neon.
- Migrações de produção não fazem parte do build automático: o banco existente
  precisa de comparação e linha de base antes de adotar a migração inicial.

Não há escrita ou abertura de PR no repositório do professor. A referência é
apenas lida; o código é atualizado exclusivamente no seu repositório.

Ajustes de responsividade preservam a navegação e a leitura em janelas estreitas;
cartões se reorganizam e as tabelas podem rolar sem ampliar toda a página.

Validação: 38 testes aprovados, verificações TypeScript e instalação limpa com
build completo aprovadas. Painel, lista e abertura/cancelamento do formulário
conferidos no navegador contra PostgreSQL local com dados demonstrativos.
