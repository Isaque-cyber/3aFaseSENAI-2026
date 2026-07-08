## 1. Banco de Dados

- [x] 1.1 Inserir a coleção vazia `"medicines": []` no arquivo `src/services/db.json`

## 2. Roteamento e Menu Lateral

- [x] 2.1 Adicionar a rota `/estoque` no arquivo `src/main.jsx` associada ao componente `MedicineStock` (dentro de `PrivateRoute` e `DashboardLayout`)
- [x] 2.2 Adicionar o link de navegação para `/estoque` no menu lateral em `src/components/SideMenu/index.jsx` usando o ícone `FaPills`

## 3. Componente do Estoque (Listagem e Busca)

- [x] 3.1 Criar o arquivo do componente `MedicineStock` em `src/components/MedicineStock/index.jsx` com a listagem básica e integração com o endpoint `http://localhost:3000/medicines` via Axios
- [x] 3.2 Implementar a lógica de busca/filtragem local (Nome, Marca ou Fabricante) na listagem de medicamentos
- [x] 3.3 Implementar a lógica de verificação de vencimento exibindo um marcador visual de atenção para medicamentos vencidos

## 4. Cadastro, Edição e Exclusão (CRUD)

- [x] 4.1 Criar formulário em modal para cadastro de novo medicamento com validação de campos obrigatórios e envio via POST para o JSON Server
- [x] 4.2 Criar funcionalidade de edição do medicamento selecionado, abrindo o modal com dados pré-preenchidos e atualizando via PUT no JSON Server
- [x] 4.3 Implementar a exclusão do medicamento com diálogo de confirmação via `window.confirm` e requisição DELETE ao JSON Server
