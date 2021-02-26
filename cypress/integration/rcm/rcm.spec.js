/// <reference types="cypress" />

context('INIT', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/')
  })

  // it('Dummy test - Login', () => {
  //   cy.get('div')
  // })

  it('.click() - Should be able to click on scope icon', () => {
    cy.get(':nth-child(2) > ion-col.md > input-con > .form-input > .input-wrapper > .input-icon-button > .infield')
    .click()
    .wait(1000);
  })

  it('Expect 1st should get proper value', () => {
    cy.get(':nth-child(2) > ion-col.md > input-con > .form-input > .input-wrapper > .input-icon-button > .infield')
    .click()
    cy.get(':nth-child(1) > .dropdown-inner')
    .contains('CAN CEN-Ontario - 1962 Rirci Key')
    // .wait(1000);
  })

  it('1st item should be able to click and goto next page. After next page, test the process drop down.', () => {
    
    cy.get(':nth-child(2) > ion-col.md > input-con > .form-input > .input-wrapper > .input-icon-button > .infield')
    .click()
    cy.get(':nth-child(1) > .dropdown-inner')
    .click()
    .wait(1000);
    cy.get('.stepper-info > .test-icon')
    .click()
    .wait(1000);
    cy.get('.stepper-info > .test-icon')
    .click()
    .wait(1000);
  })

  it('Click on second radio item, than click on inside.', () => {
    cy.get(':nth-child(2) > ion-col.md > input-con > .form-input > .input-wrapper > .input-icon-button > .infield')
    .click()
    cy.get(':nth-child(1) > .dropdown-inner')
    .click()
    cy.get('ion-list > div:nth-child(2) > ion-radio-group > ion-item')
    .click()
    .wait(1000);
    cy.get(':nth-child(2) > ion-col.md > .button-group > :nth-child(2)')
    .click()
    .wait(1000);
  })


  it('get shadow DOM element', () => {
    cy.get(':nth-child(2) > ion-col.md > input-con > .form-input > .input-wrapper > .input-icon-button > .infield')
    .click()
    cy.get(':nth-child(1) > .dropdown-inner')
    .click()
    cy.get('ion-item:nth-child(1)')
    .should('be.visible') 
    cy.get('ion-radio')
      .shadow()
      .find('label')
      .should('contain.text', '1 - Critical');
    cy.get('ion-radio')
      .shadow()
      .find('label')
      .should('contain.text', '2 - Minimal Impact');
    cy.get('ion-radio')
      .shadow()
      .find('label')
      .should('contain.text', '3 - Non-Critical');
    cy.get('ion-radio')
      .shadow()
      .find('label')
      .should('contain.text', '4 - Critical Environment');
    })

    it('Test back button and confirm popup', () => {
      cy.get(':nth-child(2) > ion-col.md > input-con > .form-input > .input-wrapper > .input-icon-button > .infield')
      .click()
      cy.get(':nth-child(1) > .dropdown-inner')
      .click()

      cy.get('app-header > :nth-child(1) > .test-icon')
      .click()
      cy.get('.alert-wrapper .button-2 span.alert-button-inner')
      .should('contain.text', 'Continue')
      cy.get('.alert-wrapper .button-1 span.alert-button-inner')
      .should('contain.text', 'Cancel')
      .wait(3000)
      .click()

      cy.get('.botton-container ion-button:nth-child(2)')
      .should('contain.text', 'Next')
      cy.get('.botton-container ion-button:nth-child(1)')
      .should('contain.text', 'Back')
      .click();

      cy.get('.alert-wrapper .button-2 span.alert-button-inner')
      .should('contain.text', 'Continue')
      .wait(1500)
      .click()
    })
    
})

