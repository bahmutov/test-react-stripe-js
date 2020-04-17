import React from 'react'
import {mount} from 'cypress-react-unit-test'
import SplitForm from './SplitForm'
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
    mount(<Elements stripe={stripePromise}><SplitForm /></Elements>, {
      style
    })

    // cy.get('input[name=cardnumber]')
  })
})
