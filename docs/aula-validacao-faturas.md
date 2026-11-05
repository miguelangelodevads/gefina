# Aula: validação de faturas

Alinhamento de 5 de novembro de 2026, referência da aula: `da29a38`.

## O que mudou

Antes, a API enviava diretamente os dados recebidos ao banco. Agora, o Zod
verifica os dados antes de criar ou editar uma fatura. Quando há um erro, a API
responde com HTTP 400 e identifica os campos que precisam de correção. A janela
permanece aberta para o aluno corrigir os valores, sem perder o que digitou.

## Regras da aula

- Cliente: identificador numérico inteiro maior que zero.
- Valor: número inteiro maior que zero, representado em centavos. R$ 10,50 vira 1050.
- Situação: `pending` ou `paid`. `overdue` é calculado pela consulta, não gravado.
- Emissão e vencimento: datas válidas no formato `AAAA-MM-DD`.
- O vencimento não pode ser anterior à emissão; pode ser no mesmo dia.

## Caminho dos dados para estudar

1. `web/src/InvoiceForm.tsx`: transforma reais em centavos e envia os valores.
2. `web/src/invoiceApi.ts`: faz o POST ou PUT e devolve os erros por campo.
3. `api/invoice.route.ts`: chama `invoiceSchema.safeParse` antes do serviço.
4. `api/invoice.schema.ts`: descreve as regras e transforma os erros do Zod.
5. `api/invoice.service.ts`: grava apenas os valores que passaram na validação.
6. `web/src/InvoicePage.tsx`: mantém os erros no estado e libera o botão após a resposta.
7. `web/src/InvoiceForm.tsx`: mostra a mensagem junto ao campo correspondente.

`safeParse` devolve um resultado com `success`. Se for falso, usamos `error`;
se for verdadeiro, usamos `data`, em vez de confiar no corpo original recebido.
O tipo `InvoiceInput` da API agora é inferido do esquema com `z.infer`.

## Como praticar

Na pasta do projeto, execute `npm test --prefix api`. Os testes usam banco
simulado: não acessam o Neon nem alteram faturas reais.

Para observar as respostas HTTP, inicie sua API com o ambiente de desenvolvimento
e execute os exemplos de validação no fim de `api/requests.http`. Eles devem
retornar HTTP 400 com `error.fields`, sem gravar os dados inválidos.

No formulário, preencha uma emissão posterior ao vencimento e corrija-a. O
navegador pode impedir o envio antes da API por causa de `required` e `min`;
por isso, os exemplos HTTP também são importantes: clientes externos não estão
obrigados a respeitar a validação visual.

Esta atualização não altera tabelas, dados demonstrativos, variáveis do Neon ou
configurações de publicação no Render.
