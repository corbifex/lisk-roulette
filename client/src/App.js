import React from 'react';
import Prando from "prando";
import openSocket from 'socket.io-client';
import { getAddressAndPublicKeyFromPassphrase } from "@liskhq/lisk-cryptography";
import { SocketContext } from './actions/socket-context';
import { Login } from './components/login';
import { Table } from './components/table';
import { Transactions } from './components/transactions';
import { doFaucetTransaction } from './transactions/101_faucet';
import { TransmitTransactions } from './actions/transmit-transactions';
import { requestAddress } from "./actions/request";
import logo from './assets/images/logo.png';
import { TxViewer } from "./components/txviewer";
import { fields, multiplier, selectors } from "./transactions/1001_bet_roulette";
import win2 from "./assets/audio/win2.mp3";
import win3 from "./assets/audio/win3.wav";
import win4 from "./assets/audio/win4.mp3";
import lose4 from "./assets/audio/lose4.wav";
import './App.css';

const BigNum = require('bignumber.js');

const socket = openSocket('https://ws.roulette.delegate.moosty.com/');

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      login: false,
      loginOpen: false,
      account: {
        passphrase: "",
        publicKey: "",
        address: "",
        balance: new BigNum(-1),
      },
      loginRef: React.createRef(),
      TransmitTransactions: new TransmitTransactions(),
      view: 0,
    };

  }

  win2 = new Audio(win2);
  win3 = new Audio(win3);
  win4 = new Audio(win4);
  lose1 = new Audio(lose4);

  async login(passphrase, name) {
    // sub to address balance + request
    // doFaucetTransaction if no account found
    const address = getAddressAndPublicKeyFromPassphrase(passphrase);
    this.setState({
      account: {
        username: name,
        passphrase: passphrase,
        publicKey: address.publicKey,
        address: address.address,
        balance: new BigNum(-1),
        lastWin: 0,
      },
      login: true,
      currentView: -1,
    });
    requestAddress(address.address, socket, (err, account) => this.checkAccount(account, name));
  }

  playSound(sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }

  getLuckyNumber(hash) {
    const rng = new Prando(hash);
    return rng.nextInt(0, 36);
  }

  result(field, luckyNumber) {
    // check won/lost
    if (field <= 36 && field === luckyNumber) {
      return true;
    } else if (field > 36 &&
      field < 49 &&
      selectors[fields[field]].indexOf(luckyNumber) > -1) {
      return true;
    }
    return false;
  }

  multiplier(field) {
    if (field <= 36) {
      return 35;
    } else if (field > 36) {
      return multiplier[fields[field]];
    }
  }

  profit(bet, luckyNumber) {
    let profit = 0;
    bet.map(bet => {
      if (this.result(parseInt(bet.field), luckyNumber)) {
        profit += (bet.amount * this.multiplier(parseInt(bet.field))) + bet.amount;
      }
      return true;
    });
    return profit.toFixed(0);
  }

  getPayout(bet) {
    if (bet && bet.tx && bet.seed) {
      return this.profit(JSON.parse(bet.tx.asset.data), this.getLuckyNumber(bet.seed));
    }
    return 0;
  }

  checkAccount(account, name) {
    if (account === null || new BigNum(account.balance).lt(1000000000)) {
      this.state.TransmitTransactions.send(
        doFaucetTransaction(this.state.account.address, this.state.account.publicKey, this.state.account.passphrase, name))
    }
    if (account !== null) {
      setTimeout(() => {
        this.setState({account: {...this.state.account, balance: new BigNum(account.balance).div(100000000)}});
      }, 7500);
    }
  }

  doBet(transaction) {
    this.state.TransmitTransactions.send(transaction);
  }

  requestTokens() {
    socket.emit('address', this.state.account.address);
  }

  lowerBalance(amount) {
    this.setState({account: {...this.state.account, balance: new BigNum(this.state.account.balance).minus(amount)}});
  }

  lastBet(bet) {
    const profit = this.getPayout(bet);
    if (profit > 0) {
      if (profit < 1) {
        this.playSound(this.lose1);
      } else if (profit > 0 && profit < 50) {
        this.playSound(this.win4);
      } else if (profit >= 50 && profit < 100) {
        this.playSound(this.win2);
      } else if (profit >= 100) {
        this.playSound(this.win3);
      }
    }
    this.setState({account: {...this.state.account, lastWin: profit}});
  }

  logout() {
    this.setState({
      account: {
        passphrase: "",
        publicKey: "",
        address: "",
        balance: new BigNum(-1),
      },
      login: false,
    })
  }

  toggleLogin() {
    this.setState({loginOpen: !this.state.loginOpen})
  }

  view(id) {
    this.setState({view: id});
  }

  render() {
    return (
      <SocketContext.Provider value={socket}>
        <div className="App">
          <div className="Loaded-app">
            <Login drawer={this.state.loginOpen} requestTokens={this.requestTokens.bind(this)} account={this.state.account}
                   login={this.login.bind(this)} loggedIn={this.state.login} logout={this.logout.bind(this)}/>
            <Table lastBet={this.lastBet.bind(this)} lowerBalance={this.lowerBalance.bind(this)} doBet={this.doBet.bind(this)} loggedIn={this.state.login}
                   account={this.state.account} login={this.toggleLogin.bind(this)} />
            <Transactions view={this.view.bind(this)} login={this.state.login} account={this.state.account}/>
          </div>
          <img className="logo" src={logo} alt="logo"/>
        </div>
        {this.state.view > 0 && <TxViewer id={this.state.view} view={this.view.bind(this)} open={true}/>}
      </SocketContext.Provider>
    );
  }
}
