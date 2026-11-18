# Comparação do alinhamento

Referências conferidas em 18/11/2026: main do professor 4a4bf70 e
refactor/stylization em adb7ba6.
Comparação com a branch local refactor/database-access.

## Testes da interface: diferenças corrigidas

- web/src/InvoiceForm.test.tsx: atualizado com os sete testes atuais.
- web/src/test.setup.ts: adicionado, com limpeza e simulação de dialog.
- web/vite.config.ts: ambiente jsdom e arquivo de preparação configurados.
- web/package.json e package-lock.json: Vitest 5.1.0, jsdom 31.0.1,
  Testing Library React 16.3.3 e user-event 14.6.10 instalados.
- Scripts test e test:watch em web; atalho test:web na raiz.

Verificação executada em 18/11: os sete testes passaram, assim como TypeScript
e build Vite com Tailwind.
Os testes e a configuração Vite foram copiados da referência, sem substituir
os componentes de produção do projeto.

## Prisma: diferenças ainda pendentes

O professor já converteu invoice.service.ts, customer.service.ts e
dashboard.service.ts para o cliente Prisma. Aqui os serviços continuam usando pg.
O modelo, a migração inicial e prisma.ts estão presentes como preparação.
Ainda faltam o seed Prisma, os scripts postinstall/seed/migrate:deploy e a
adaptação dos testes e tratamento dos erros do banco à conversão dos serviços.
A migração inicial precisa de análise de compatibilidade/linha de base antes
que se planeje sua adoção sobre o Neon existente.

O seed da referência usa TRUNCATE com RESTART IDENTITY. Ele não foi executado.
A configuração de testes local com banco descartável, as validações de POST/PUT,
o health check e as melhorias de acessibilidade foram preservados.

## Diferenças que não são conteúdo faltante

Há diferenças de formatação e melhorias locais em InvoiceForm, InvoicePage e
invoiceApi. Elas incluem rótulos de erros associados aos campos, estado ocupado
e tratamento das falhas na edição e na atualização da lista. Não foram removidas
para tornar os arquivos textualmente iguais.

Os arquivos estão na branch refactor/database-access e no PR #35, em rascunho.
A main e a versão publicada não receberam esta preparação. Neon e Render não
foram modificados nesta integração de testes.

## Estilização: preparação incorporada em 18/11

Tailwind CSS e o plugin Vite 4.3.5 foram instalados. A configuração Vite e o tema
vieram da nova branch de referência. Mantivemos o CSS anterior abaixo do tema
para os componentes que ainda utilizam classes antigas. O professor removeu
esse CSS em sua branch inicial; a conversão dos componentes ainda não aparece
no commit de referência. A aula explica essa diferença e como prosseguir.

A integração Prisma descrita acima continua pendente. Esta atualização não deve
ser interpretada como igualdade completa de código entre os repositórios.
