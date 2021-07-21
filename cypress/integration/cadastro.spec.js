/// <reference types="cypress" />

// Carregar Chance
const Chance = require('chance')

// Instancie o Chance para que ele possa ser usado
const chance = new Chance()

context('Cadastro', () => {
  it('Cadastro de Usuário no Site', () => { // Cenário
    // Trabalhando com rotas e esperas

    // POST 200 /api/1/databases/userdetails/collections/newtable?apiKey=YEX0M2QMPd7JWJw_ipMB3a5gDddt4B_X
    // POST 200 /api/1/databases/userdetails/collections/usertable?apiKey=YEX0M2QMPd7JWJw_ipMB3a5gDddt4B_X
    // GET 200 /api/1/databases/userdetails/collections/newtable?apiKey=YEX0M2QMPd7JWJw_ipMB3a5gDddt4B_X

    // cy.server() // O uso do cy.route exige o start do cy.server

    // O uso de ** antes da / é chamado de caractere coringa. Ou seja não importa o host que antece a rota /api e o token que vem depois do /newtable?**
    // FIXME - Essas 3 linhas abaixo funcionariam se a aplicação estivesse estável.
    // cy.route('POST', '**/api/1/databases/userdetails/collections/newtable?**').as('postNewTable') // as é o alias. Que é uma variável temporária do Cypress.
    // cy.route('POST', '**/api/1/databases/userdetails/collections/usertable?**').as('postUserTable')
    // cy.route('GET', '**/api/1/databases/userdetails/collections/newtable?**').as('getNewTable')

    // HACK - Como a aplicação está instável, devemos criar mocks.
    // Dessa forma sendo possível reproduzir o fluxo de cadastro.

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

    // Type = Comando para digitar texto em um campo

    cy.get('input[placeholder="First Name"]').type(chance.first())
    cy.get('input[ng-model="LastName"]').type(chance.last())
    cy.get('input[ng-model="EmailAdress"]').type(chance.email())
    cy.get('input[ng-model="Phone"]').type(chance.phone({ formatted: false })) // Formata a máscara do telefone. Veriifcar se tem como deixar no padrão utilzado no Brasil

    // Check = Comando para interagir com radio buttons e checkbox

    cy.get('input[value="Male"]').check()
    cy.get('input[type="checkbox"]').check('Cricket') // Irá clicar no checkbox que possui a palavra Cricket
    cy.get('input[type="checkbox"]').check('Hockey') // Irá clicar no checkbox que possui a palavra Hockey

    // Select e combos

    cy.get('select#Skills').select('Javascript') // Irá clicar no combo e selecionar a opção 'Javascript'
    cy.get('select#countries').select('Brazil')
    cy.get('select#country').select('United States of America', { force: true })

    cy.get('select#yearbox').select('1986')
    cy.get('select[ng-model="monthbox"]').select('October')
    cy.get('select#daybox').select('5')

    cy.get('input#firstpassword').type('#Pw123456')
    cy.get('input#secondpassword').type('#Pw123456')

    // Realizando o upload de arquivo. Passar o nome do arquivo, no caso uploadFile.jpg

    cy.get('input#imagesrc').attachFile('uploadFile.jpg')

    // Enviando o cadastro com o click no botão de submissão
    cy.get('button#submitbtn').click()

    // Esperar a resposta de uma rota. Exemplo: cy.route('POST', '**/api/1/databases/userdetails/collections/newtable?**').as('postNewTable')
    // Então (then) fazer alguam coisa com essa reposta da rota. No caso validar o status de reposta do servidor ou o response body.
    cy.wait('@postNewTable').then((resNewtable) => {
      // console.log(resNewtable.status)
      // cy.log(resNewtable.status)

      // HACK - Realizando asserções com o uso de expect
      // O chai utlizar o expect e should para asserções
      // Espero do response (demos o nome de resNewtable) que ele tenha o status igual a 200 (nesse caso está null, pois a aplicação está fora do ar)
      expect(resNewtable.status).to.eq(200) // Nesse caso tem que ser expect, com should o teste falha
    })

    cy.wait('@postUserTable').then((resUserTable) => {
      expect(resUserTable.status).to.eq(200)
    })

    cy.wait('@getNewTable').then((resNewTable) => {
      expect(resNewTable.status).to.eq(200)
    })

    // Validando se a url contain a palarava WebTable na url.
    // Devido a problemas na aplicação, não está realizando o cadastro e redirecionando para a página de WebTable.
    cy.url().should('contain', 'WebTable') // Nesse caso tem que ser should, com expect o teste falha

    cy.screenshot()
  })
})

/* HACK - Elementos mapeados

input[placeholder="First Name"]
input[ng-model="LastName"]
input[ng-model="EmailAdress"]
input[ng-model="Phone"]

input[value="Male"]
input[type="checkbox"]

O uso de # é quando mapeamos id's
O uso de . é quando mapeamos classes

select#Skills

select#countries
select#country

select#yearbox
select[ng-model="monthbox"] // Esse não possui id
select#daybox

*/
