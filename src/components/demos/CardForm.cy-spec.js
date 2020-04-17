import React from 'react'
import {mount} from 'cypress-react-unit-test'
import CardForm from './CardForm'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "../../styles.css";

/* global before, cy */
let stripePromise
before(() => {
  stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");
  return stripePromise
})

// extra style to make it prettier
const style = `
  body {
    padding: 1rem;
  }
`

describe('Card', () => {
  it('looks pretty', () => {
    mount(<Elements stripe={stripePromise}><CardForm /></Elements>, {
      style
    })

    // credit card form is inside an iframe
    // so we will need to take care when accessing it
    // cy.get('input[name=cardnumber]')

    // wait for stripe to load
    cy.window().should('have.property', 'stripe')
    // let's spy!
    .then(stripe => {
      // cy.spy(stripe, 'createPaymentMethod').as('createPaymentMethod')
    })

    // the Pay button is outside the iframe

    cy.contains('button', 'Pay').click()
  })
})
