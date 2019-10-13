import React from 'react';
import './account.css';

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
        <div className="Saldo">Total: {this.state.saldo} Tokens</div>
        <div className="Current-bet">Current Bet: {this.state.current} Tokens {this.state.confirmed}</div>
        <div className="Confirmed" onClick={this.confirm.bind(this)}>Confirm bet</div>
      </div>
    );
  }
}
