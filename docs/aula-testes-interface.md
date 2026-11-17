# Aula: testando o formulário de faturas

Referência conferida em **17/11/2026**: branch `test/graphic-interface` do professor,
commit `4b5cb59`. Essa etapa ainda não está na main dele. No seu projeto, os arquivos, dependências e scripts desta etapa já estão
instalados na branch `refactor/database-access`. As etapas 2 a 4 explicam como
recriar a configuração; para executar os arquivos existentes, vá à etapa 6.

## 1. Qual problema queremos resolver?

Você já consegue testar a API. Agora queremos saber se o usuário consegue localizar
os campos e se o formulário entrega os valores corretos ao clicar em Salvar.
Não precisamos acessar Neon ou Render para responder a essas perguntas.

Vitest executa os testes. React Testing Library monta o componente e permite
localizar os elementos. user-event simula interações. jsdom fornece um ambiente
com elementos HTML dentro do processo de testes.

Um teste de componente não abre um navegador real nem garante que a página esteja
bonita no celular. Ele verifica comportamentos do componente. Testes HTTP verificam
outra parte: a comunicação com a API. Os dois tipos se complementam.

## 2. Prepare uma branch para praticar

Primeiro, confira se há alterações suas antes de trocar de branch:

```sh
git status
```

Se a pasta estiver limpa e você estiver na branch de estudo, crie uma branch de
exercício com um nome ainda não usado:

```sh
git switch -c estudo/testes-interface
```

Na raiz do Gefina, instale as dependências usadas nessa referência de aula:

```sh
npm install --prefix web --save-dev vitest@5.1.0 jsdom@31.0.1 @testing-library/react@16.3.3 @testing-library/user-event@14.6.10
```

Em web/package.json, adicione aos scripts existentes:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Mantenha dev, build e check. As vírgulas precisam separar as propriedades JSON;
o bloco acima é um trecho, não o conteúdo completo do arquivo.

## 3. Configure o ambiente

Em web/vite.config.ts, conserve o plugin React e o proxy da API e use:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test.setup.ts'],
  },
});
```

Crie web/src/test.setup.ts:

```ts
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};

HTMLDialogElement.prototype.close = function () {
  this.open = false;
  this.dispatchEvent(new Event('close'));
};
```

cleanup remove o componente depois de cada teste. As funções de dialog simulam
as operações usadas pelo formulário; não implementam foco, layout e todos os
comportamentos de uma janela modal real.

## 4. Escreva os dois primeiros testes

Crie web/src/InvoiceForm.test.tsx com o conteúdo abaixo. O sufixo .test.tsx
permite identificar um teste que também contém JSX.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import InvoiceForm from './InvoiceForm.tsx';

function renderForm(onSubmit = vi.fn()) {
  render(
    <InvoiceForm
      invoice={null}
      customers={[{
        id: 1,
        name: 'Cliente de Teste',
        email: 'cliente@teste.com.br',
      }]}
      error={null}
      fieldErrors={{}}
      onDelete={() => {}}
      confirmDelete={false}
      setConfirmDelete={() => {}}
      confirm={() => {}}
      onCancel={() => {}}
      onSubmit={onSubmit}
      busy={false}
    />,
  );
  return onSubmit;
}

describe('InvoiceForm', () => {
  it('apresenta os campos com rótulo associado', () => {
    renderForm();
    for (const label of [
      'Cliente', 'Valor', 'Situação', 'Emissão', 'Vencimento',
    ]) {
      expect(screen.getByLabelText(label)).toBeDefined();
    }
  });

  it('entrega os valores convertidos no envio', async () => {
    const user = userEvent.setup();
    const onSubmit = renderForm();

    await user.selectOptions(screen.getByLabelText('Cliente'), '1');
    await user.type(screen.getByLabelText('Valor'), '1250.37');
    await user.selectOptions(screen.getByLabelText('Situação'), 'pending');
    await user.type(screen.getByLabelText('Emissão'), '2026-11-01');
    await user.type(screen.getByLabelText('Vencimento'), '2026-11-30');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      customerId: 1,
      amount: 125037,
      status: 'pending',
      issueDate: '2026-11-01',
      dueDate: '2026-11-30',
    });
  });
});
```

O exemplo segue os dois comportamentos da aula do professor. A função renderForm
apenas evita repetir a montagem do componente.

## 5. Entenda antes de executar

- render monta o formulário com um cliente fictício e sem uma fatura em edição.
- getByLabelText procura o campo associado ao rótulo. Se não encontrar, o teste falha.
- vi.fn cria uma função que registra as chamadas recebidas.
- user.type e selectOptions simulam o preenchimento; await aguarda as interações.
- getByRole encontra o botão pelo papel e pelo nome visível.
- toHaveBeenCalledWith confere o objeto entregue a onSubmit.

O campo Valor recebe 1250.37, mas amount deve ser 125037. O sistema armazena
centavos inteiros. customerId passa de um valor de formulário para um número.
As datas permanecem strings YYYY-MM-DD.

onSubmit é uma função simulada: este teste não envia uma fatura ao banco.
Ele prova que o formulário entrega os valores esperados à próxima camada.

## 6. Execute e leia o resultado

Na raiz do projeto:

```sh
npm test --prefix web
npm run check --prefix web
npm run build --prefix web
```

Com apenas esse arquivo, a expectativa é ver dois testes aprovados.
Para executar automaticamente ao salvar:

```sh
npm run test:watch --prefix web
```

Encerre o acompanhamento com Ctrl+C. Se aparecer “Missing script: test”, confira
se salvou os scripts no package.json de web. Se document não existir no ambiente
do teste, confira environment: jsdom e o arquivo de configuração.
Se o botão não for encontrado, leia os nomes disponíveis no erro antes de mudar
o teste. Um campo required vazio pode impedir o envio: preencha todos os campos.

## 7. Exercício para fazer sozinho

Troque 1250.37 por 49.90 e escreva primeiro quanto espera em amount: 4990.
Execute o teste com esse novo valor. Depois faça uma expectativa errada de propósito,
como 499, execute e compare o valor esperado com o recebido. Corrija em seguida.

Para avançar, crie um teste que recebe busy=true e verifica que o botão Salvar
fica desabilitado. Você pode usar a propriedade disabled do elemento:

```ts
const button = screen.getByRole('button', { name: 'Salvar' });
expect((button as HTMLButtonElement).disabled).toBe(true);
```

Essa expectativa precisa de uma montagem com busy=true. Não altere o componente
para satisfazer o teste sem antes conferir a regra desejada.

Ao terminar, explique a diferença entre testar o formulário, testar uma rota HTTP
e testar o fluxo completo em um navegador real.

## Verificação desta integração

Os dois testes originais do professor foram incorporados e executados com sucesso.
A verificação TypeScript e o build Vite também passaram. Você pode executar
`npm run test:web` na raiz ou `npm test --prefix web`.
