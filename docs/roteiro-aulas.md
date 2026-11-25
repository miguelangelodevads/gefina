# Gefina: roteiro de estudo atualizado em 24/11/2026

A main do professor está em b6746b8. As etapas de Prisma, testes da interface,
Tailwind e organização em camadas foram mescladas. Nesta conferência só existe
a branch main no repositório dele; isso não significa que o curso inteiro acabou.

## Ordem sugerida

1. [Validação de faturas](aula-validacao-faturas.md): entrada, Zod e mensagens.
2. [Testes da API](aula-testes-api.md): Express, requisições e banco temporário.
3. [Prisma](aula-prisma.md): modelo, cliente, consultas, migração e seed.
4. [Testes da interface](aula-testes-interface.md): os sete casos do formulário.
5. [Tailwind](aula-tailwind.md): tema e classes utilitárias nos componentes.
6. [Arquitetura atual](aula-arquitetura.md): navegue entre as novas pastas.

## Estado real da atualização

As etapas de código acima estão incorporadas ao projeto, incluindo a conversão
que estava pendente dos serviços para Prisma. As validações de POST/PUT, a
acessibilidade, o health check e o isolamento dos testes foram preservados.
O CSS antigo foi substituído pelos componentes com classes utilitárias.

A migração inicial e a carga demonstrativa não foram executadas no Neon.
A carga local possui proteção contra uso em bancos remotos.
Veja [o comparativo](comparacao-alinhamento.md) para as diferenças intencionais.

## Como estudar

Siga uma ação por vez: listar, criar, editar e excluir. Localize a tela, a chamada
HTTP, a rota, o schema e o serviço. Leia o teste correspondente antes de modificar.
Explique com suas palavras o papel de cada arquivo e tente reproduzir uma consulta
simples em uma branch de exercício.

Referência de leitura: https://github.com/alexgeracaotech/gefina-gt02/commit/b6746b8601f64f13beef99aec73456d565635e71
