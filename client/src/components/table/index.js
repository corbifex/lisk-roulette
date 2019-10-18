import React from 'react';
import _ from 'lodash';
import { SocketContext } from '../../actions/socket-context';
import { Roulette } from '../roulette';
import { Field } from '../field';
import { Account } from "./account";
import { Tokens } from "./tokens";
import { subscribeToStatus, subscribeToPeerBets } from "../../actions/subscribe";
import { doRouletteBetTransaction } from '../../transactions/1001_bet_roulette';
import './table.css';

const BigNum = require('bignumber.js');

export class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unconfirmedBets: [],
      confirmedBets: [],
      peerBets: [],
      amountSelected: 1,
      totalBet: 0,
      totalBetConfirmed: 0,
      repeat: false,
      auto: false,
      state: 3,
      showPeers: true,
    };
    subscribeToStatus(props.socket, (err, status) => this.updateStatus(status));
    subscribeToPeerBets(props.socket, (err, bet) => this.addPeerBets(bet));
  }

  addPeerBets(bet) {
    if (bet.address !== this.props.account.address) {
      const bets = this.splitToTokens(new BigNum(bet.amount).div(100000000).toNumber(), [25, 5, 1]);
      let peerBets = [];
      for (let i = 0; i < bets.length; i++) {
        peerBets.push({field: bet.field, amount: bets[i]});
      }
      this.setState({peerBets: [...this.state.peerBets, ...peerBets]});
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

  updateStatus(status) {
    if (this.state.state !== status) {
      if (status === 0) {
        if (!this.state.repeat) {
          this.clear();
        } else {
          if (this.state.totalBetConfirmed > 0) {
            this.setState({
              peerBets: [],
              state: 0,
              totalBetConfirmed: 0,
              totalBet: this.state.totalBetConfirmed,
              unconfirmedBets: this.state.confirmedBets,
              confirmedBets: []
            });
          } else {
            this.setState({
              peerBets: [],
              state: 0,
              totalBetConfirmed: 0,
              confirmedBets: []
            });
          }
        }
      } else if (status === 1) {
        if (this.state.auto) {
          this.confirm();
        }
        this.setState({state: 1});
      } else if (status === 2) {
        this.setState({state: 2});
      } else if (status === 3) {
        this.setState({state: 3});
      }
    }
  }

  clickField(field) {
    if (this.state.state === 0 && this.props.loggedIn && this.props.account.balance.gte(this.state.totalBet + this.state.amountSelected) && this.state.totalBetConfirmed === 0) {
      const updatedBets = [...this.state.unconfirmedBets, {field: field, amount: this.state.amountSelected}];
      let totalBet = 0;
      updatedBets.map(bet => {
        totalBet += bet.amount;
      });
      this.setState({unconfirmedBets: updatedBets, totalBet: totalBet});

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
      for (let bet = 0; bet < bets.length; bet++) {
        if (!fields[bets[bet].field]) {
          fields[bets[bet].field] = bets[bet].amount;
        } else {
          fields[bets[bet].field] += bets[bet].amount;
        }
      }
      _.map(fields, (amount, field) => {
        this.props.doBet(doRouletteBetTransaction(amount, field, this.props.account.address, this.props.account.publicKey, this.props.account.passphrase));
      });
      this.props.lowerBalance(this.state.totalBet);
      this.setState({
        totalBet: 0,
        totalBetConfirmed: this.state.totalBet,
        confirmedBets: this.state.unconfirmedBets,
        unconfirmedBets: []
      });
    }
  }

  clear() {
    this.setState({state: 0, confirmedBets: [], unconfirmedBets: [], totalBet: 0, totalBetConfirmed: 0, peerBets: []});
  }

  render() {
    return (
      <div className="Table-container">
        <div className="Table-wheel">
          <Roulette/>
        </div>
        <div className="Table-fields">
          {this.props.loggedIn &&
          <Account confirmedBet={this.state.totalBetConfirmed} currentBet={this.state.totalBet}
                   clear={this.clear.bind(this)} repeat={this.state.repeat}
                   confirm={this.confirm.bind(this)} state={this.state.state}
                   switchRepeat={this.switchRepeat.bind(this)} auto={this.state.auto}
                   switchAuto={this.switchAuto.bind(this)} account={this.props.account}
                   showPeers={this.state.showPeers} switchPeers={this.switchPeers.bind(this)}/>}
          {this.props.loggedIn &&
          <Tokens setAmount={this.setAmount.bind(this)}
          />}
          <Field loggedIn={this.props.loggedIn} userBets={this.state.unconfirmedBets}
                 confirmedBets={this.state.confirmedBets}
                 clickField={this.clickField.bind(this)} peerBets={this.state.peerBets} showPeers={this.state.showPeers}/>
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
