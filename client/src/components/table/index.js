import React from 'react';
import { Roulette } from '../roulette';
import { Field } from '../field';
import { Account } from "./account";
import { Tokens } from "./tokens";
import './table.css';

export class Table extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="Table-container">
        <div className="Table-wheel">
          <Roulette/>
        </div>
        <div className="Table-fields">
          <Account/>
          <Tokens/>
          <Field/>
        </div>
      </div>
    );
  }
}
