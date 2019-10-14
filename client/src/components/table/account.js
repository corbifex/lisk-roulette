import React from 'react';
import './account.css';
  import Button from '@material-ui/core/Button';

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
        <div className="Saldo">Total:{"\n"} 
          {this.state.saldo} Tokens</div>
        <div className="Current-bet">Current Bet:
          {"\n"} {this.state.current} Tokens {this.state.confirmed}</div>
        <Button variant="contained" color="primary" onClick={this.confirm.bind(this)}>
           Confirm bet
        </Button>
       
      </div>
    );
  }
}
