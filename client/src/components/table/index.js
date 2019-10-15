import React from 'react';
import { Roulette } from '../roulette';
import { Field } from '../field';
import { Account } from "./account";
import { Tokens } from "./tokens";
import './table.css';

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unconfirmedBets: [],
      amountSelected: 1,
    };
  }

  clickField(field) {
    const updatedBets = [...this.state.unconfirmedBets, { field: field, amount: this.state.amountSelected}];
    this.setState({ unconfirmedBets: updatedBets });
  }

  setAmount(amount) {
    console.log(amount)
    this.setState({ amountSelected: amount });
  }

  render() {
    console.log(this.state);
    return (
      <div className="Table-container">
        <div className="Table-wheel">
          <Roulette/>
        </div>
        <div className="Table-fields">
          <Account/>
          <Tokens setAmount={this.setAmount.bind(this)} />
          <Field clickField={this.clickField.bind(this)} />
        </div>
      </div>
    );
  }
}
