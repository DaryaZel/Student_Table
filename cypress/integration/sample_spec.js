describe('The Home Page', function () {
  it('successfully loads', function () {
    cy.visit('http://127.0.0.1:5500/index.html')
  })
})
context('Actions', () => {
  it('click on a GreenButton element', () => {
    cy.get('#greenbutton').click()
  })
  it('Alert text content after pressing two buttons at the same time', function () {
    const stub = cy.stub()

    cy.on('window:alert', stub)

    cy.get('#redbutton').click("right", { force: true })
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Press only one team')
      })
    cy.get('#bluebutton').click("right", { force: true })
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Press only one team')
      })
  })

})

describe("Background Color test", () => {
  it('Blue background of active bluebutton', () => {
    cy.get('.active-green')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(0, 128, 0)')

  })
  it('Red background of active redbutton', () => {
    cy.get('#greenbutton').click()
    cy.get('#redbutton').click()
    cy.get('.active-red')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(255, 0, 0)')

  })
  it('Red background of active redbutton', () => {
    cy.get('#redbutton').click()
    cy.get('#bluebutton').click()
    cy.get('.active-blue')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(0, 0, 255)')

  })

})
describe('Dialog float', function () {
  it('New students dialog float', function () {
    cy.get('#btnStudentName').click()
    cy.get("#dialog").should('be.visible');
  })
})
describe('Dialog close', function () {
  it('New students dialog close', function () {
    cy.get('#btnCancel').click()
    cy.get("#dialog").should('be.not.visible');
  })
})