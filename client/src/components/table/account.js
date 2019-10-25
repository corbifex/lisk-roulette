import React from 'react';
import './account.css';

export class Account extends React.Component {

  render() {
    return (
      <div className="Account-container">

        <div className="Account">
          <div className="Inner-Account"><span className="Inner-Account-title">Player:</span><br/>{this.props.account.username && this.props.account.username}</div>
          <div className="Inner-Account"><span className="Inner-Account-title">Total Balance:</span><br/>{this.props.account.balance && this.props.account.balance.toString()}</div>
          <div className="Inner-Account"><span className="Inner-Account-title">Bet:</span><br/>{this.props.currentBet | this.props.confirmedBet}</div>
           <div className="Inner-Account"><span className="Inner-Account-title">Last Win:</span><br/>{this.props.account.lastWin}</div>
        </div>
      </div>
    );
  }
}
