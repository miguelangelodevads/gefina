# Aula: início da estilização com Tailwind

Atualização de **18/11/2026**. Referência: branch refactor/stylization,
commit adb7ba6. A main do professor é 4a4bf70; esta etapa ainda está em trabalho.

## 1. Entenda o que mudou

Antes, o projeto usa classes como button-primary e regras CSS escritas à mão.
Tailwind fornece classes utilitárias para propriedades como cor, espaçamento
e tamanho. Ele gera o CSS necessário durante o desenvolvimento e a compilação.
React continua responsável pela interface e Vite continua compilando o projeto.

O professor adicionou tailwindcss e @tailwindcss/vite, ambos na versão 4.3.5.
O plugin tailwindcss() entrou na lista plugins de web/vite.config.ts.
O CSS passou a importar tailwindcss e declarar um tema com @theme.

Esses arquivos e dependências estão incorporados à sua branch de estudo.
O seu CSS anterior foi mantido abaixo do tema: os componentes ainda usam as
classes antigas, que o professor ainda não converteu nessa referência.
Essa é uma diferença intencional em relação ao CSS enxuto da branch dele.
A configuração adiciona também o reset de estilos base do Tailwind; confira
o resultado no navegador ao avançar com a conversão.

## 2. Leia a configuração

Trecho de web/vite.config.ts:

```ts
import tailwindcss from '@tailwindcss/vite';
// Na lista de plugins existente:
// plugins: [react(), tailwindcss()]
```

Início de web/src/index.css:

```css
@import 'tailwindcss';

@theme {
  --color-primary: #6e56cf;
  --color-surface: #171a21;
  --color-text: #e8eaed;
}
```

O exemplo mostra só parte do tema. Não substitua o arquivo inteiro por ele.
O prefixo --color- permite usar classes como bg-primary, bg-surface e text-text.
Assim, o valor da cor fica centralizado, em vez de ser repetido em cada componente.

## 3. Faça uma experiência pequena

Execute na raiz do Gefina:

```sh
npm run dev --prefix web
```

Abra o endereço mostrado pelo Vite. Para listar dados reais localmente, a API
precisa estar funcionando com uma configuração de desenvolvimento apropriada.
Para estudar apenas a aparência, você pode começar com um elemento estático.

Em um componente que aparece na tela, acrescente temporariamente:

```tsx
<p className="rounded-control bg-primary p-4 text-white">
  Estou aprendendo Tailwind no Gefina.
</p>
```

Observe o fundo, o espaço interno e os cantos. p-4 acrescenta espaço interno;
bg-primary usa a cor do tema; text-white usa branco. rounded-control usa
--radius-control definido pelo tema. Salve e veja a atualização do Vite.
Depois remova esse parágrafo para não deixá-lo na aplicação final.

## 4. Converta aos poucos

Escolha um elemento por vez. Confira seu visual e estado ocupado antes e depois.
Não remova label, htmlFor, aria-invalid, disabled, required ou os callbacks
para mudar a aparência. Os sete testes do formulário ajudam a preservar parte
desse comportamento, mas não verificam layout, contraste ou responsividade.

Não apague todo o CSS antigo antes de converter as classes dos componentes.
As regras antigas sem camadas podem ter prioridade sobre utilitários: ao converter
um elemento, revise a regra antiga correspondente para evitar estilos concorrentes.

## 5. Verifique

```sh
npm run test:web
npm run check --prefix web
npm run build --prefix web
```

O build deve gerar CSS sem erro de importação ou plugin. Para confirmar a
aparência, confira a aplicação também em uma largura de celular e com o formulário
em criação e edição. Passar nos testes não substitui essa inspeção visual.

Exercício: explique a diferença entre p-4 e m-4 e experimente em um elemento
estático. Qual muda o espaço dentro do elemento? Qual muda o espaço ao redor?
