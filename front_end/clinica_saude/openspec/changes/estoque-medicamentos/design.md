## Context

O projeto "Clínica Saúde" é uma aplicação React de gerenciamento clínico. A persistência de dados do front-end é simulada via `json-server` (atualmente executando a partir do arquivo `src/services/db.json` na porta 3000).
A fim de gerenciar medicamentos de forma digitalizada, a equipe do consultório necessita de um painel de controle do estoque com as operações clássicas de CRUD.

## Goals / Non-Goals

**Goals:**
- Criar a interface de estoque de medicamentos (`/estoque`) seguindo fielmente a identidade visual e o design system do projeto (com base nas telas de Prontuários e Dashboard).
- Adicionar suporte a CRUD completo (Create, Read, Update, Delete) de medicamentos com persistência de dados via requisições HTTP (Axios) para o `json-server`.
- Implementar pesquisa local na listagem em tempo real (Nome, Marca ou Fabricante).
- Destacar itens vencidos na listagem.
- Adicionar o atalho da tela no menu lateral do sistema (`SideMenu`).

**Non-Goals:**
- Autenticação específica por nível de acesso (médico vs. recepcionista) para controle de estoque (todos os usuários logados têm acesso total).
- Lógica de baixa de estoque automática associada a receitas de consultas médicas.
- Histórico de movimentações de estoque (entradas/saídas).

## Decisions

### 1. Modelo de Dados e Endpoint do JSON Server
- **Decisão**: Criar a coleção `"medicines"` em `src/services/db.json` com os seguintes campos: `id` (gerado automaticamente pelo json-server), `name` (string), `brand` (string), `manufacturer` (string), `expirationDate` (string, no formato `YYYY-MM-DD` padrão do HTML5 date input).
- **Razão**: O formato `YYYY-MM-DD` facilita a comparação de datas diretamente em JavaScript (usando `new Date(expirationDate)`) e a ordenação/filtragem, minimizando problemas com múltiplos formatos de datas.

### 2. Interface de Modificações (Cadastro e Edição)
- **Decisão**: Utilizar modais na mesma tela para Cadastro e Edição em vez de redirecionar para novas páginas de formulário.
- **Razão**: Mantém a experiência de SPA rápida e fluida, em consonância com a lógica já estabelecida no restante do projeto.

### 3. Integração com Tailwind CSS Dark Mode
- **Decisão**: Adaptar as classes do novo componente usando regras de cores condicionais para a classe `dark` nos elementos (ex: `bg-white dark:bg-gray-800`), seguindo o padrão de estilização global implementado em `index.css`.
- **Razão**: Garante compatibilidade direta e consistente com o Dark Mode implementado no `DashboardLayout.jsx`.

## Risks / Trade-offs

- **[Risco] Inconsistência de formato de data no input vs exibição**
  - *Mitigação*: No formulário, usaremos o `<input type="date">` nativo do HTML (que retorna `YYYY-MM-DD`). Ao renderizar a listagem para o usuário, faremos o parse da string de data para exibir no formato tradicional brasileiro `DD/MM/AAAA`.
- **[Risco] Deleção acidental de registros de medicamentos**
  - *Mitigação*: Implementar um pop-up de confirmação antes de disparar o `axios.delete`, evitando perda de dados por cliques acidentais.
