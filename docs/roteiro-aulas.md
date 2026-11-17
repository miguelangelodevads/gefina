# Gefina: roteiro de estudo atualizado

Atualização conferida em **17 de novembro de 2026**.

## O que mudou desde 10/11

A referência da main do professor passou de `3c136ea` para `f9ead51`.
O PR #36 concluiu a integração do Prisma. A próxima aula já começou na branch
`test/graphic-interface`, commit `4b5cb59`, ainda fora da main.

| Etapa | No professor | No seu material/projeto |
| --- | --- | --- |
| Express separado do servidor e testes HTTP | Concluída | Implementada e explicada |
| Validação com Zod e mensagens no formulário | Concluída | Implementada e explicada |
| Modelo Prisma e migração inicial | Concluída | Preparados na branch de estudo |
| Serviços de faturas, clientes e painel com Prisma | Concluída | Explicados; serviços locais ainda usam SQL |
| Seed e script de migração de produção | Concluída | Explicados; não executados no Neon |
| Testes de componentes React | Em branch de trabalho | Arquivos, configuração e dependências incorporados |

A etapa de testes de interface está incorporada à branch de estudo, além dos
documentos. A conversão dos serviços para Prisma ainda está pendente nesta branch.
Não houve alteração no banco ou no serviço Render.

## Ordem para aprender com calma

1. **Revisão do fluxo:** o navegador mostra React; o formulário envia JSON; Express
   recebe a requisição; Zod valida; o serviço acessa PostgreSQL; a resposta volta
   para React. Prisma entra na parte do serviço que acessa o banco.
2. **Validação:** leia [a aula de validação](aula-validacao-faturas.md).
   Explique por que amount é inteiro em centavos e por que o servidor valida
   mesmo quando o formulário possui campos obrigatórios.
3. **Testes HTTP:** siga [a aula de testes da API](aula-testes-api.md).
   Pratique os testes de validação sem banco antes da suíte com Docker.
4. **Prisma:** siga [a aula atualizada](aula-prisma.md), começando no modelo.
   Compare findMany com SELECT e create com INSERT.
5. **Migração e seed:** leia as seções 8 e 9 da aula de Prisma. Explique por que
   a migração inicial não deve ser aplicada diretamente às tabelas já existentes.
6. **Interface:** siga [a nova aula de testes do formulário](aula-testes-interface.md).
   Primeiro teste os rótulos; depois simule o preenchimento e o clique em Salvar.

Estude uma etapa por vez. Ao terminar, tente reproduzir o exemplo sem copiar,
explique cada linha e altere um valor para prever como a resposta muda.

## Como conferir futuras novidades manualmente

No GitHub do professor, veja a main e também a lista de branches. Um trabalho novo
pode estar em uma branch antes de aparecer na main. Em Pull requests, confira se
está aberto ou mesclado. Abra Files changed e separe mudanças de comportamento,
dependências, configuração e apenas formatação.

No seu projeto, confira primeiro git status para preservar alterações locais.
Compare os arquivos antes de copiar. Não faça push nem abra PR no repositório
do professor. Os links abaixo servem apenas como referências de leitura.

## Referências conferidas

- Main do professor: https://github.com/alexgeracaotech/gefina-gt02/commit/f9ead51092e8578c9bc6eae8d475d8861e61324f
- Nova etapa da interface: https://github.com/alexgeracaotech/gefina-gt02/commit/4b5cb59fa544e974e0440a9e7b1442585a57ebc5
- Sua preparação em rascunho: https://github.com/miguelangelodevads/gefina/pull/35

Os links não marcam o professor em issues, comentários ou PRs.
