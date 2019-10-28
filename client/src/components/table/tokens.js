import React from 'react';
import token1 from '../../assets/images/1.png';
import token5 from '../../assets/images/5.png';
import token25 from '../../assets/images/25.png';
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
        500
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
      "Token-div"
    ];

    classNames[this.state.selected] = "Token-div Selected";

    return (
      <div className="Token-container">
        <div className={classNames[0]} ><span onClick={this.selectToken.bind(this, 0)} className="Token-number">1</span></div>
        <div className={classNames[1]} ><span onClick={this.selectToken.bind(this, 1)} className="Token-number">5</span></div>
        <div className={classNames[2]} ><span onClick={this.selectToken.bind(this, 2)} className="Token-number">25</span></div>
        <div className={classNames[3]} ><span onClick={this.selectToken.bind(this, 3)} className="Token-number">50</span></div>
        <div className={classNames[4]} ><span onClick={this.selectToken.bind(this, 4)} className="Token-number">100</span></div>
        <div className={classNames[5]} ><span onClick={this.selectToken.bind(this, 5)} className="Token-number">500</span></div>
      </div>
    );
  }
}
