/// <reference types="cypress" />

context('Listagem', () => {
  // BUG - Por algum motivo fazer o uso do beforeEach faz com que o teste "Listagem com apenas um registro registro", não retorne os dados de mock.
  // beforeEach(() => {
  //   cy.visit("WebTable.html")

  // })

  it('Listagem sem registro', () => {
    // 'GET', '**/api/1/databases/userdetails/collections/newtable?**'

    cy.server()
    cy.route({
      method: 'GET',
      url: '**/api/1/databases/userdetails/collections/newtable?**',
      status: 200,
      response: 'fx:webTable-get-vazio' // HACK - Para essa spec de Listagem vai ficar vazio, devido não ter o "_id" dentro do objeto do arquivo webTable-get-vazio.json. Ou simplesmente em response (linha 12) passar {}, ficando response: {}
    }).as('getNewtable')

    cy.visit('WebTable.html')

    // Validando se existe apenas uma linha na tabela, sendo essa linha o cabeçalho.
    cy.get('div[role=row]').should('have.length', 1)

    cy.screenshot()
  })

  it('Listagem com apenas um registro registro', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '**/api/1/databases/userdetails/collections/newtable?**',
      status: 200,
      response: 'fx:webTable-get-unico'
    }).as('getNewtable')

    // FIXME - E necessário passar o cy.visit após a utilização das rotas, caso contrário não apresenta os dados de mocks.
    cy.visit('WebTable.html')

    cy.get('div[role=row] div[role=gridcell]')
      .eq(4) // A tabela possui 6 posições, e devemos interagir com a coluna 'Phone' que é a 5ª. Porém na programação a contagem inicia em ZERO, sendo assim a posição a ser informada deve ser a 4.
      .find('div')
      .as('gridCellPhone') // HACK - Poderia realizar o should após o find. Porém para mostrar uma outra forma, foi criado um 'alias', e depois chamado um novo cy.get para realizar a validação.

    cy.get('@gridCellPhone').should('contain.text', '1234567890')

    cy.screenshot()
  })
})

// HACK - Interagindo com elementos

/*

1 -> .first()
2 ->
3 -> .eq(4)
4 ->
5 -> .last()

*/
