/// <reference types="cypress" />

Given(/^que o site não possui registros$/, () => {
  cy.server()
  cy.route({
    method: 'GET',
    url: '**/api/1/databases/userdetails/collections/newtable?**',
    status: 200,
    response: 'fx:webTable-get-vazio' // HACK - Para essa spec de Listagem vai ficar vazio, devido não ter o "_id" dentro do objeto do arquivo webTable-get-vazio.json. Ou simplesmente em response (linha 12) passar {}, ficando response: {}
  }).as('getNewtable')
})

When(/^acessar a listagem$/, () => {
  cy.visit('WebTable.html')
})

Then(/^devo visualizar a listagem vazia$/, () => {
  // Validando se existe apenas uma linha na tabela, sendo essa linha o cabeçalho.
  cy.get('div[role=row]').should('have.length', 1)

  cy.screenshot()
})

Given(/^que o site possui apenas um registro$/, () => {
  cy.server()
  cy.route({
    method: 'GET',
    url: '**/api/1/databases/userdetails/collections/newtable?**',
    status: 200,
    response: 'fx:webTable-get-unico'
  }).as('getNewtable')
})

Then(/^devo visualizar a listagem com um registro$/, () => {
  cy.get('div[role=row] div[role=gridcell]')
    .eq(4) // A tabela possui 6 posições, e devemos interagir com a coluna 'Phone' que é a 5ª. Porém na programação a contagem inicia em ZERO, sendo assim a posição a ser informada deve ser a 4.
    .find('div')
    .as('gridCellPhone') // HACK - Poderia realizar o should após o find. Porém para mostrar uma outra forma, foi criado um 'alias', e depois chamado um novo cy.get para realizar a validação.

  cy.get('@gridCellPhone').should('contain.text', '1234567890')

  cy.screenshot()
})
