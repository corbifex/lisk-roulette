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

  render() {

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

    return (
      <div className="Token-container">
        <div className={classNames[0]} onClick={this.selectToken.bind(this, 0)}><span className="Token-number">1</span></div>
        <div className={classNames[1]} onClick={this.selectToken.bind(this, 1)}><span className="Token-number">5</span></div>
        <div className={classNames[2]} onClick={this.selectToken.bind(this, 2)}><span className="Token-number">25</span></div>
        <div className={classNames[3]} onClick={this.selectToken.bind(this, 3)}><span className="Token-number">50</span></div>
        <div className={classNames[4]} onClick={this.selectToken.bind(this, 4)}><span className="Token-number">100</span></div>
        <div className={classNames[5]} onClick={this.selectToken.bind(this, 5)}><span className="Token-number">500</span></div>
        <div className={classNames[6]} onClick={this.selectToken.bind(this, 6)}><span className="Token-number">1000</span></div>
      </div>
    );
  }
}
