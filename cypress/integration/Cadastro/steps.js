// Implementação dos passos descritos nas features
// Adicionar mecanismos que conectem as frases descritas com os comandos do Cypress.

/// <reference types="cypress" />

// Carregar Chance
const Chance = require('chance')

// Instancie o Chance para que ele possa ser usado
const chance = new Chance()

When(/^quando informar meus dados$/, () => {
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
})

When(/^salvar$/, () => {
  // Enviando o cadastro com o click no botão de submissão
  cy.get('button#submitbtn').click()
})

Then(/^devo ser cadastrado com sucesso$/, () => {
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
