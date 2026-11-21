# Problema e Contexto do Sistema (Etapa 1)

## Problema
Uma locadora de veículos de pequeno porte precisa organizar o controle de clientes, veículos e aluguéis, que hoje é feito de forma manual. Isso gera dificuldades para consultar informações, registrar devoluções, acompanhar valores e visualizar relatórios do negócio.

## Solução proposta
Desenvolver um sistema web com API e front-end para gerenciar o cadastro de clientes, fabricantes, categorias e veículos, além de controlar os aluguéis realizados. O sistema também deve oferecer consultas e relatórios para apoiar a tomada de decisão.

## Objetivos
- Facilitar o cadastro, edição, exclusão e consulta das entidades principais.
- Registrar aluguéis e devoluções com cálculo do valor total.
- Disponibilizar relatórios e visualizações com base nas consultas do banco de dados.
- Apoiar o controle financeiro com consulta de saldo, recarga e registro de pagamento dos aluguéis.

## Entidades e funcionalidades planejadas
- **Clientes**: cadastro, edição, exclusão e pesquisa (filtros por nome e CPF).
- **Fabricantes**: cadastro, edição, exclusão e pesquisa (filtros por nome e ID).
- **Categorias**: cadastro, edição, exclusão e pesquisa (filtros por nome e ID).
- **Veículos**: cadastro, edição, exclusão e pesquisa (filtros por modelo e ano), com vínculo a fabricante e categoria.
- **Aluguéis**: registro, edição/devolução, exclusão e pesquisa (filtros por cliente e situação), com vínculo a cliente e veículo.
- **Relatórios/Consultas**: veículos com fabricantes, aluguéis por cliente, clientes com/sem aluguéis, quantidade de veículos por fabricante e aluguéis em aberto.
- **Carteira do cliente**: consulta de saldo, recarga de saldo e pagamento de aluguel utilizando o saldo disponível.

## Dados fictícios previstos (exemplos)
- **Clientes**: Ana Souza (CPF 12345678901, ana@email.com), Bruno Lima (CPF 98765432100, bruno@email.com).
- **Fabricantes**: Fiat, Volkswagen, Chevrolet.
- **Categorias**: Hatch, Sedan, SUV.
- **Veículos**: Uno 2020 (Fiat/Hatch), Onix 2022 (Chevrolet/Hatch), T-Cross 2023 (Volkswagen/SUV).
- **Aluguéis**: Ana alugou Uno em 10/11/2026 (R$ 120,00/dia), Bruno alugou Onix em 12/11/2026 e devolveu em 14/11/2026.

## Telas previstas (wireframes)
1. **Dashboard/Relatórios**: cards e tabelas com as consultas do banco (veículos por fabricante, aluguéis em aberto, clientes com/sem aluguéis etc.).
2. **Clientes**: listagem com filtros, formulário de cadastro/edição e ação de exclusão.
3. **Fabricantes**: listagem com filtros e formulário de cadastro/edição.
4. **Categorias**: listagem com filtros e formulário de cadastro/edição.
5. **Veículos**: listagem com filtros, seleção de fabricante/categoria e formulário de cadastro/edição.
6. **Aluguéis**: listagem com filtros, registro de novo aluguel e registro de devolução/pagamento.
7. **Carteira/Saldo**: seleção de cliente, consulta de saldo, recarga e pagamento de valores pendentes.

Essas telas orientam o desenvolvimento do front-end e a organização da navegação do sistema.