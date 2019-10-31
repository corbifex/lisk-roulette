import React from 'react';
import './roulette.css';
import { SocketContext } from "../../actions/socket-context";
import Button from '@material-ui/core/Button';

export class RouletteComponent extends React.Component {

  getState() {
    if (!this.props.loggedIn) {
      return (<Button onClick={this.props.login.bind(this)} className="spinbttn" variant="contained" color="primary">
        <div className="mask">LOGIN</div>
      </Button>);
    }
    if (this.props.account.balance.lte(-1)) {
      return (
        <div className="mask">Wait for chips</div>
      );
    }
    if (this.props.state.state === -2 && this.props.account.balance.eq(0)) {
      return (
        <div className="mask">Get new chips</div>
      );
    }
    if (this.props.state.state === -2 && this.props.account.balance.gt(0) && this.props.account.balance.minus(this.props.state.totalBetConfirmed).lt(0)) {
      return (
        <div className="mask">Place bets</div>
      );
    }
    switch (this.props.state.state) {
      case -2:
        return (
          <Button onClick={this.repeat.bind(this)} className="spinbttn" variant="contained" color="primary">
        <div className="mask">{this.props.lastBets.length > 0 && `Repeat`}</div>
      </Button>);
      case 0:
        return <div className="mask">No more bets</div>;
      case 1:
        return <div className="mask">No more bets</div>;
      case 2:
        return <div className="mask">{`${this.props.state.rolledNumber === 'roll' ? "Fool!" : `Nr. ${this.props.state.rolledNumber}`}`}</div>;
      default:
        return (<Button onClick={this.spin.bind(this)} className="spinbttn" variant="contained" color="primary">
          <div className="mask">Spin</div>
        </Button>);
    }
  }

  repeat() {
    this.props.repeat();
  }

  spin() {
    this.props.spin();
  }

  render() {
    let ballClass = `inner inner-roll`;
    if (this.props.state.rolledNumber !== 'roll' && this.props.state.state >= 1) {
      ballClass = `inner inner-${this.props.state.rolledNumber} `;
    }
    if (this.props.state.rest) {
      ballClass += 'rest';
    }
    if (this.props.state.reset) {
      ballClass = "inner";
    }

    if (this.props.state.state < 0) {
      ballClass = " hide-ball ";
    }
    return (
      <div className="main">
        <div className="plate" id="plate">
          <ul className={ballClass}>
            <li className="number"><label><input type="radio" name="pit" value="32"/><span
              className="pit">32</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="15"/><span
              className="pit">15</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="19"/><span
              className="pit">19</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="4"/><span
              className="pit">4</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="21"/><span
              className="pit">21</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="2"/><span
              className="pit">2</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="25"/><span
              className="pit">25</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="17"/><span
              className="pit">17</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="34"/><span
              className="pit">34</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="6"/><span
              className="pit">6</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="27"/><span
              className="pit">27</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="13"/><span
              className="pit">13</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="36"/><span
              className="pit">36</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="11"/><span
              className="pit">11</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="30"/><span
              className="pit">30</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="8"/><span
              className="pit">8</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="23"/><span
              className="pit">23</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="10"/><span
              className="pit">10</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="5"/><span
              className="pit">5</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="24"/><span
              className="pit">24</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="16"/><span
              className="pit">16</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="33"/><span
              className="pit">33</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="1"/><span
              className="pit">1</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="20"/><span
              className="pit">20</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="14"/><span
              className="pit">14</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="31"/><span
              className="pit">31</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="9"/><span
              className="pit">9</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="22"/><span
              className="pit">22</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="18"/><span
              className="pit">18</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="29"/><span
              className="pit">29</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="7"/><span
              className="pit">7</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="28"/><span
              className="pit">28</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="12"/><span
              className="pit">12</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="35"/><span
              className="pit">35</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="3"/><span
              className="pit">3</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="26"/><span
              className="pit">26</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="0"/><span
              className="pit">0</span></label></li>
          </ul>
          <div className="data">
            <div className="data-inner">
              {this.getState()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const Roulette = props => (
  <SocketContext.Consumer>
    {socket => <RouletteComponent {...props} socket={socket}/>}
  </SocketContext.Consumer>
);

