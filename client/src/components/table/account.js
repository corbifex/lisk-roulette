import React from 'react';
import './account.css';
  import Button from '@material-ui/core/Button';
import { Checkbox } from "@material-ui/core";

export class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {saldo: 122323, current: 50, confirmed: "(unconfirmed)"};
  }

  confirm() {
    this.setState({confirmed: "(Confirmed)"});
  }

  render() {
    return (
      <div className="Account-container">
        <div className="Saldo">Total balance: <br />{this.state.saldo}</div>
        <div className="Current-bet">Current Bet:
          <br /> {this.props.currentBet}</div>
        <Button variant="contained" className="Confirmed" onClick={this.confirm.bind(this)}>
           Confirm bet
        </Button>
      </div>
    );
  }
}
