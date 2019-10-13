import React from 'react';
import './faucetButton.css';

export class FaucetButton extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="Faucet-button-container">
        <a href="#">Get Tokens</a>
      </div>
    );
  }
}
