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
    mount(
      <Elements stripe={stripePromise}>
        <CardForm />
      </Elements>,
      {
        style
      }
    )

    const cc = '1111 2222 3333 4444'
    const month = '01'
    const year = '30'
    const cvc = '123'

    // credit card form is inside an iframe
    // so we will need to take care when accessing it
    const iframeSelector = '[title="Secure payment input frame"]'
    cy.frameLoaded(iframeSelector)
    cy.iframe(iframeSelector).find('input[name=cardnumber]')
      .type(`${cc} ${month} ${year}`)

    cy.iframe(iframeSelector).find('input[name=cvc]')
      .type(cvc)

    // wait for stripe to load
    // cy.window().should('have.property', 'stripe')
    // let's spy!
    // .then(stripe => {
      // TODO figure out the getter that prevents stubbing
      // cy.spy(stripe, 'createPaymentMethod').as('createPaymentMethod')
    // })

    // TODO look up how we set up XHR interception in component tests
    // then copy the enhanced object into the iframe (is it even necessary?)
    cy.server()
    cy.route('POST', 'https://api.stripe.com/v1/payment_methods', 'fx:incorrect-number').as('pay')

    cy.get(iframeSelector).its('0.contentWindow')
      .then(win => {
        win.XMLHttpRequest = XMLHttpRequest
        debugger
      })

    // the Pay button is outside the iframe, so just click it
    cy.contains('button', 'Pay').click()
  })
})
