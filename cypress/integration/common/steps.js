// Steps/Passos comuns a mais de uma feature

Given(/^que acesso o site$/, () => {
  cy.server()

  cy.route({
    method: 'POST',
    url: '**/api/1/databases/userdetails/collections/newtable?**',
    status: 200,
    response: 'fx:webTable-get-vazio' // HACK - Pegando as informações de mock.
  }).as('postNewTable')

  cy.route({
    method: 'POST',
    url: '**/api/1/databases/userdetails/collections/usertable?**',
    status: 200,
    response: 'fx:webTable-get-vazio'
  }).as('postUserTable')

  cy.route({
    method: 'GET',
    url: '**/api/1/databases/userdetails/collections/newtable?**',
    status: 200,
    response: 'fx:webTable-get-vazio'
  }).as('getNewTable')

  cy.visit('Register.html')
})
