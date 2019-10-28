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
      "Token-div",
      "Token-div",
      "Token-div",
      "Token-div",
      "Token-div",
      "Token-div",
      "Token-div"
    ];

    classNames[this.state.selected] = "Token-div Selected noselect";
    let total = 0;
    for (let i = 0; i < this.props.bet.length; i++) {
      total = total + this.props.bet[i].amount;
    }
    for (let i = 0; i < this.state.tokens.length; i++ ) {
      if (this.props.balance.minus(total).gte(this.state.tokens[i])) {
        tokens.push(<div className={classNames[i]} onClick={this.selectToken.bind(this, i)}><span className="Token-number">{this.state.tokens[i]}</span></div>)
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
