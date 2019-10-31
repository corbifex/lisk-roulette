import React from 'react';
import './tokens.css';

export class Tokens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      tokens: [
        1,
        5,
        25,
        50,
        100,
        500,
        1000
      ]
    };
    this.props.setAmount(this.state.tokens[this.state.selected]);
  }

  selectToken(token) {
    this.props.setAmount(this.state.tokens[token]);
    this.setState({selected: token});
  }

  getTokens() {
    let tokens = [];
    let classNames = [
      "Token-div noselect ",
      "Token-div noselect ",
      "Token-div noselect ",
      "Token-div noselect ",
      "Token-div noselect ",
      "Token-div noselect ",
      "Token-div noselect "
    ];

    classNames[this.state.selected] += "Selected";
    let total = 0;
    for (let i = 0; i < this.props.bet.length; i++) {
      total = total + this.props.bet[i].amount;
    }
    let plusOne = false;
    if (this.props.balance.eq(-1) || this.props.balance.minus(total).lte(0)) {
      plusOne = true;
    }
    for (let i = 0; i < this.state.tokens.length; i++ ) {
      if (!plusOne && this.props.balance.minus(total).gte(this.state.tokens[i])) {
        tokens.push(<div key={`token-${i}`} className={classNames[i]} onClick={this.selectToken.bind(this, i)}><span className="Token-number">{this.state.tokens[i]}</span></div>)
      } else if (!plusOne) {
        plusOne = true;
        tokens.push(<div key={`token-${i}`} className={classNames[i]} onClick={this.selectToken.bind(this, i)}><span className="Token-number">All In</span></div>)
      } else {
        tokens.push(<div key={`token-${i}`} className="Token-div noselect disabled" ><span className="Token-number" /></div>)
      }
    }

    return tokens;
  }

  render() {

    return (
      <div className="Token-container">
        {this.getTokens()}
      </div>
    );
  }
}
