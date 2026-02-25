
# ENTREGA 8 — Descritivo de Casos de Teste de Software

## 8.1 Casos de Teste

A tabela abaixo relaciona os casos de teste aos requisitos funcionais do sistema.

| ID Caso de Teste | ID Requisito Funcional | Descrição | Precondição | Passos | Resultado Esperado |
|------------------|------------------------|-----------|-------------|--------|--------------------|
| CT-01 | RF-Login | Validar login com dados válidos | Usuário cadastrado no sistema | 1. Acessar tela de login<br>2. Informar e‑mail e senha válidos<br>3. Clicar em entrar | Usuário acessa o dashboard |
| CT-02 | RF-Pedido | Criar novo pedido com sucesso | Usuário autenticado | 1. Acessar cadastro de pedido<br>2. Preencher dados obrigatórios<br>3. Salvar | Pedido registrado com sucesso |
| CT-03 | RF-Filtro | Filtrar pedidos por status | Pedidos cadastrados no sistema | 1. Acessar listagem de pedidos<br>2. Selecionar filtro<br>3. Aplicar | Lista atualizada conforme filtro |

---

## 8.2 Ferramentas e Ambientes de Teste

### Ferramentas de Teste
- Navegador (Chrome DevTools)
- Postman
- Console do navegador

### Ambiente de Teste

**Servidor de Teste:** Ambiente local do aluno  
**Banco de Dados / Versão:** PostgreSQL (exemplo)  
**Browser / Versão:** Google Chrome (última versão)

---

## Observações
- Cada requisito funcional deve possuir pelo menos um caso de teste.
- Testar cenários de sucesso e erro.
- Registrar evidências quando possível.