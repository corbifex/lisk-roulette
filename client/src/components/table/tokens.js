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
        25
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
      "Token",
      "Token",
      "Token",
    ];

    classNames[this.state.selected] = "Token Selected";

    return (
      <div className="Token-container">
        <img className={classNames[0]} src={token1} alt="Bet 1" onClick={this.selectToken.bind(this, 0)}/>
        <img className={classNames[1]} src={token5} alt="Bet 5" onClick={this.selectToken.bind(this, 1)}/>
        <img className={classNames[2]} src={token25} alt="Bet 25" onClick={this.selectToken.bind(this, 2)}/>
      </div>
    );
  }
}
