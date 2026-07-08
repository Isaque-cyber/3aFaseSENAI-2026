## ADDED Requirements

### Requirement: Listagem de Medicamentos no Estoque
O sistema SHALL exibir uma listagem contendo todos os medicamentos registrados no estoque. Para cada medicamento, o sistema SHALL exibir o nome, marca, fabricante e a data de vencimento formatada no padrão DD/MM/AAAA.

#### Scenario: Visualização da listagem de estoque
- **WHEN** o usuário acessa a rota `/estoque`
- **THEN** o sistema exibe uma tabela ou lista com as colunas Nome, Marca, Fabricante e Vencimento contendo os dados dos medicamentos cadastrados

### Requirement: Busca de Medicamentos por Filtro
O sistema SHALL possuir um campo de busca que permita filtrar a lista de medicamentos em tempo real por nome, marca ou fabricante (busca case-insensitive).

#### Scenario: Filtragem por nome de medicamento
- **WHEN** o usuário digita "Paracetamol" no campo de busca de medicamentos
- **THEN** o sistema exibe apenas os medicamentos cujo nome, marca ou fabricante contenha a palavra "Paracetamol"

### Requirement: Identificação e Alerta de Medicamento Vencido
O sistema SHALL verificar a data de vencimento de cada medicamento em relação à data atual e, caso o medicamento esteja vencido, SHALL exibir um destaque visual legível de alerta (ex: "VENCIDO" ou indicação de atenção).

#### Scenario: Alerta de medicamento vencido na listagem
- **WHEN** a data de vencimento de um medicamento é anterior à data atual do sistema
- **THEN** o sistema exibe um marcador visual de atenção na linha do respectivo medicamento

### Requirement: Cadastro de Novo Medicamento
O sistema SHALL permitir o cadastro de novos medicamentos por meio de um formulário contendo os campos: Nome, Marca, Fabricante e Data de Vencimento. Todos os campos são de preenchimento obrigatório. Os dados do novo medicamento SHALL ser salvos no JSON Server na coleção `medicines` e uma notificação de sucesso SHALL ser exibida via Toast.

#### Scenario: Cadastro de medicamento com sucesso
- **WHEN** o usuário preenche todos os campos obrigatórios do formulário e clica em "Salvar"
- **THEN** o sistema envia uma requisição POST para o JSON Server, insere o medicamento na coleção e exibe a mensagem de sucesso "Medicamento cadastrado com sucesso!"

### Requirement: Edição de Medicamento Existente
O sistema SHALL permitir a edição dos dados de um medicamento já cadastrado. O formulário SHALL ser pré-preenchido com os dados atuais do medicamento. Ao salvar, as alterações SHALL ser enviadas para o JSON Server e atualizadas na tela.

#### Scenario: Edição de medicamento com sucesso
- **WHEN** o usuário clica no botão "Editar" de um medicamento, altera o campo Marca e clica em "Salvar"
- **THEN** o sistema envia uma requisição PUT para o JSON Server e atualiza a exibição do medicamento na lista com a nova Marca

### Requirement: Exclusão de Medicamento
O sistema SHALL permitir a exclusão de um medicamento. Após a exclusão no JSON Server, a lista de medicamentos em tela SHALL ser atualizada automaticamente.

#### Scenario: Exclusão de medicamento com sucesso
- **WHEN** o usuário clica no botão "Deletar" de um medicamento na listagem
- **THEN** o sistema envia uma requisição DELETE correspondente ao ID do medicamento para o JSON Server e o remove imediatamente da exibição em tela
