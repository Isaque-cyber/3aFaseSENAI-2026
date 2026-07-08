## Why

Atualmente, a clínica não possui um local centralizado para controle e gerenciamento do estoque de medicamentos. Um módulo de estoque de medicamentos permitirá que médicos e funcionários registrem, consultem, editem e excluam itens em estoque, evitando o vencimento silencioso de medicamentos e otimizando a reposição.

## What Changes

- Criação de uma tela de gerenciamento de estoque de medicamentos (`/estoque`).
- Criação de um formulário para cadastro e edição de medicamentos.
- Inclusão do link "Estoque" no menu lateral (`SideMenu`).
- Criação de um endpoint no JSON Server (`/medicines`) para persistência de dados.
- Implementação de um filtro de busca para filtrar medicamentos por nome, marca ou fabricante em tempo real.
- Alertas visuais para medicamentos vencidos.

## Capabilities

### New Capabilities

- `estoque-medicamentos`: Controle de estoque de medicamentos da clínica, incluindo nome, marca, fabricante e data de vencimento com persistência de dados.

### Modified Capabilities

## Impact

- **Banco de Dados (`db.json`)**: Inclusão da chave `"medicines"`.
- **Roteamento (`src/main.jsx`)**: Inclusão da rota `/estoque`.
- **Menu Lateral (`src/components/SideMenu/index.jsx`)**: Inclusão de um novo item com link para a rota `/estoque`.
- **Estilização**: Uso das classes TailwindCSS integradas ao tema claro/escuro do projeto.
