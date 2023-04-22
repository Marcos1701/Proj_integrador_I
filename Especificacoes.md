# Especificações de requisitos

## **Especificação de casos de uso**


**1 ) Criar nova tarefa:**<br/>
- *Fluxo Principal:*
   - pré-condições: o usuário deve estar autenticado no sistema e deve estar na tela 
       de criação.
   - O usuario insere o titulo e/ ou uma descrição e uma data prevista para conclusão.
   - O sistema verifica se algum campo está vazio.
   - O sistema verifica se algum campo não excede o limite de caracteres previstos para
       os mesmos.
   - O usuário clica no botão "Criar".
   - Pos-condições: A nova tarefa é exibida na tela principal, seguindo a organização
       prevista pelo filtro aplicado pelo usuário.
<br/>

- *Fluxo Alternativo:*
    - Campo "Titulo" vazio: O sistema cria uma nova tarefa, com o título padrão: "Nova Tarefa".
    - Algum campo excede o limite de caracteres: O sistema informa ao usuario que o campo em especí-
         fico excedeu o limite de caracteres e impossibilita a criação da nova tarefa.
    - Usuário cancela criação: O sistema não salva os dados inseridos nos campos no banco de dados e
        retorna á tela principal da aplicação.
<br/>

**2 ) Remover tarefa:** <br/>

- *Fluxo Principal:*
   - pré-condições: o usuário deve estar autenticado no sistema e deve estar na tela 
       de confimação de exclusão.
   - O usuário clica no botão "Confirmar".
   - Pos-condições: Os dados da tarefa são excluídos do banco de dados e as demais tarefas
       são exibidas conforme a organização prevista pelo filtro aplicado pelo usuário.
<br/>

- *Fluxo Alternativo:*
    - Usuário cancela a exclusão: O sistema retorna á tela principal.

<br/>

**3 ) Alterar tarefa:** <br/>

- *Fluxo Principal:*
   - pré-condições: o usuário deve estar autenticado no sistema e deve estar na tela 
       de alteração.
   - O usuario insere o novo titulo e/ ou uma nova descrição e uma nova data prevista para conclusão.
   - O sistema verifica se algum campo está vazio.
   - O sistema verifica se algum campo não excede o limite de caracteres previstos para
       os mesmos.
   - O usuário clica no botão "Confirmar".
   - Pos-condições: A nova versão da tarefa é exibida na tela principal, seguindo a 
       organização prevista pelo filtro aplicado pelo usuário.
       
<br/>

- *Fluxo Alternativo:*
    - Algum campo vazio: O sistema não altera o valor do campo.
    - Algum campo excede o limite de caracteres: O sistema informa ao usuario que o campo em especí-
         fico excedeu o limite de caracteres e impossibilita a alteração da tarefa.
    - Usuário cancela alteraçãoação: O sistema retorna á tela principal da aplicação.
