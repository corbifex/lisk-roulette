import React from 'react';
import _ from 'lodash';
import { SocketContext } from '../../actions/socket-context';
import { Roulette } from '../roulette';
import { Field } from '../field';
import { Account } from "./account";
import { Tokens } from "./tokens";
import { subscribeToBlocks, subscribeToPeerBets } from "../../actions/subscribe";
import { doRouletteBetTransaction } from '../../transactions/1001_bet_roulette';
import './table.css';
import Prando from "prando";


const BigNum = require('bignumber.js');

export class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rest: false,
      reset: true,
      rolledNumber: 'roll',
      unconfirmedBets: [],
      confirmedBets: [],
      lastBets: [],
      peerBets: [],
      amountSelected: 1,
      totalBet: 0,
      totalBetConfirmed: 0,
      repeat: false,
      auto: false,
      state: -2,
      showPeers: false,
      watch: false,
    };
    subscribeToBlocks(props.socket, (err, blockSignature) => this.updateBlock(blockSignature));
    subscribeToPeerBets(props.socket, (err, bet) => this.addPeerBets(bet));
  }

  updateBlock(blockSignature) {
    const rng = new Prando(blockSignature);
    const draw = rng.nextInt(0, 36);
    if (this.state.rolledNumber === 'roll') {
      this.setState({rolledNumber: draw});
    }
  }

  addPeerBets(bet) {
    if (this.state.state > -1) {
      let peerBets = [];
      const betParsed = JSON.parse(bet.bet);
      const list = betParsed.map(b => {
        const bets = this.splitToTokens(b.amount, [25, 5, 1]);
        for (let i = 0; i < bets.length; i++) {
          peerBets.push({field: b.field, amount: bets[i]});
        }
        return true;
      });
      this.setState({peerBets: [...this.state.peerBets, ...peerBets], list: list});
    }
  }

  splitToTokens(amount, tokens) {
    if (amount === 0) {
      return [];
    } else {
      if (amount >= tokens[0]) {
        let left = amount - tokens[0];
        return [tokens[0]].concat(this.splitToTokens(left, tokens));
      } else {
        tokens.shift();
        return this.splitToTokens(amount, tokens);
      }
    }
  }

  updateWatch(watch) {
    if (watch !== this.state.watch) {
      this.setState({watch: watch});
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.loggedIn === false && nextProps.loggedIn === true) {
      this.setState({state: -1})
    }
  }

  clickField(field) {
    if (!this.state.watch && this.props.loggedIn && this.props.account.balance.gte(this.state.totalBet + this.state.amountSelected) && this.state.totalBetConfirmed === 0) {
      const updatedBets = [...this.state.unconfirmedBets, {field: field, amount: this.state.amountSelected}];

      let totalBet = 0;
      updatedBets.map(bet => {
        totalBet += bet.amount;
        return true;
      });
      this.setState({unconfirmedBets: updatedBets, totalBet: totalBet, state: -1});

    }
  }

  setAmount(amount) {
    this.setState({amountSelected: amount});
  }

  switchAuto() {
    this.setState({auto: !this.state.auto});
  }

  switchPeers() {
    this.setState({showPeers: !this.state.showPeers});
  }

  switchRepeat() {
    this.setState({repeat: !this.state.repeat});
  }

  confirm() {
    if (new BigNum(this.props.account.balance).lt(this.state.totalBet)) {
      this.clear();
    } else {
      const bets = this.state.unconfirmedBets;
      let fields = {};
      let amount = 0;
      for (let bet = 0; bet < bets.length; bet++) {
        if (!fields[bets[bet].field]) {
          fields[bets[bet].field] = bets[bet].amount;
        } else {
          fields[bets[bet].field] += bets[bet].amount;
        }
        amount += bets[bet].amount;
      }
      const bet = _.map(fields, (amount, field) => {
        return {field: field, amount: amount};
      });
      this.props.doBet(doRouletteBetTransaction(
        amount,
        bet,
        this.props.account.address,
        this.props.account.publicKey,
        this.props.account.passphrase));

      this.props.lowerBalance(this.state.totalBet);
      this.setState({
        rest: false,
        reset: true,
        rolledNumber: 'roll',
        state: 0,
        totalBet: 0,
        totalBetConfirmed: this.state.totalBet,
        confirmedBets: this.state.unconfirmedBets,
        unconfirmedBets: [],
        watch: true,
      });

      setTimeout(() => {
        this.setState({reset: false});
      }, 15);
      setTimeout(() => {
        this.setState({rest: false, state: 1, reset: true});
        setTimeout(() => {
          this.setState({reset: false});
        }, 15);
        setTimeout(() => {
          this.setState({rest: true, state: 2});
          setTimeout(() => {
            this.updateWatch(false);
            this.clear();
          }, 7000);
        }, 2500);
      }, 6000);
    }
  }

  repeat() {
    const updatedBets = [...this.state.lastBets];
    let totalBet = 0;
    updatedBets.map(bet => {
      totalBet += bet.amount;
      return true;
    });
    this.setState({unconfirmedBets: updatedBets, totalBet: totalBet, state: -1});
  }

  clear() {
    this.setState({
      state: -2,
      lastBets: this.state.confirmedBets,
      confirmedBets: [],
      unconfirmedBets: [],
      totalBet: 0,
      totalBetConfirmed: 0,
      peerBets: []
    });
  }

  render() {
    return (
      <div className="table-section">
      <div className="Table-container">
        <div className="Table-wheel">
          <Roulette repeat={this.repeat.bind(this)} lastBets={this.state.lastBets} loggedIn={this.props.loggedIn} login={this.props.login.bind(this)} spin={this.confirm.bind(this)} state={this.state}/>
        </div>
        <div className="Table-fields">
          {this.props.loggedIn &&
          <Account confirmedBet={this.state.totalBetConfirmed} currentBet={this.state.totalBet}
                   clear={this.clear.bind(this)} repeat={this.state.repeat}
                   confirm={this.confirm.bind(this)} state={this.state.state}
                   switchRepeat={this.switchRepeat.bind(this)} auto={this.state.auto}
                   switchAuto={this.switchAuto.bind(this)} account={this.props.account} lastWin={this.props.lastWin}
                   showPeers={this.state.showPeers} switchPeers={this.switchPeers.bind(this)}/>}
          {this.props.loggedIn &&
          <Tokens setAmount={this.setAmount.bind(this)}
          />}
          <Field rolledNumber={this.state.rolledNumber} state={this.state.state} watch={this.state.watch}
                 loggedIn={this.props.loggedIn} userBets={this.state.unconfirmedBets}
                 confirmedBets={this.state.confirmedBets}
                 clickField={this.clickField.bind(this)} peerBets={this.state.peerBets}
                 showPeers={this.state.showPeers}/>
        </div>
      </div>
      </div>
    );
  }
}

export const Table = props => (
  <SocketContext.Consumer>
    {socket => <TableComponent {...props} socket={socket}/>}
  </SocketContext.Consumer>
);
