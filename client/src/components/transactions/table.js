import React from 'react';
import Prando from 'prando';
import * as timeago from 'timeago.js';
import { fields, multiplier, selectors } from '../../transactions/1001_bet_roulette';
import { subscribeToResults } from '../../actions/subscribe';
import { requestResult } from '../../actions/request';
import { Address } from "../address";
import { TxViewer } from "../txviewer";
import { EPOCH_TIME_MILLISECONDS } from '../../transactions/time';
import win1 from '../../assets/audio/win1.wav';
import win2 from '../../assets/audio/win2.mp3';
import win3 from '../../assets/audio/win3.wav';
import win4 from '../../assets/audio/win4.mp3';
import lose4 from '../../assets/audio/lose4.wav';
import './table.css';
import { SocketContext } from "../../actions/socket-context";
const BigNum = require('bignumber.js');

export class TransactionTableComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      transactions: [],
      win1: new Audio(win1),
      win2: new Audio(win2),
      win3: new Audio(win3),
      win4: new Audio(win4),
      lose1: new Audio(lose4),
      loaded: false,
      view: 0,
    };
    subscribeToResults(props.socket, (err, block) => this.updateBlock(block));
    requestResult(props.socket);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.login !== nextProps.login && nextProps.private !== "") {
      this.setState({transactions: []});
    }
  }

  updateBlock(block) {
    if (block.length > 0) {
      for (let i = block.length - 1; i >= 0; i--) {
        this.addBlock(block[i]);
      }
      this.setState({loaded: true});
    } else {
      setTimeout(() => {
        this.addBlock(block);
      }, 7000);
    }
  }

  addBlock(block) {
    if (this.state.blocks.indexOf(block.id) === -1) {
      let blocks = [block.id, ...this.state.blocks];
      let txs = [...this.state.transactions];
      if (block.numberOfTransactions > 0) {
        for (let i = block.transactions.length - 1; i >= 0; i--) {
          if (block.transactions[i].type === 1001) {
            if ((!this.props.private && !this.props.login) || (this.props.private !== false && this.props.private === block.transactions[i].senderId)) {
              txs = [{...block.transactions[i], luckyNumber: this.getLuckyNumber(block.blockSignature)}, ...txs];
              if (this.state.loaded && this.props.private !== false && this.props.private === block.transactions[i].senderId) {
                // player result
                let profit = this.profit(JSON.parse(block.transactions[i].asset.data), this.getLuckyNumber(block.blockSignature));
                if (profit < 1) {
                  this.playSound(this.state.lose1);
                } else if (profit > 0 && profit < 50) {
                  this.playSound(this.state.win4);
                } else if (profit >= 50 && profit < 100) {
                  this.playSound(this.state.win2);
                } else if (profit >= 100) {
                  this.playSound(this.state.win3);
                }
              }
            }
          }
        }
      }
      this.setState({blocks: blocks, transactions: txs})
    }
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
    return profit.toString();
  }

  getPayout(bet) {
    return this.profit(JSON.parse(bet.asset.data), bet.luckyNumber);
  }

  getColumn(column, type) {
    switch (type) {
      case 'time':
        return (<div className="TT-column">{timeago.format(new Date(EPOCH_TIME_MILLISECONDS + (column*1000)))}</div>);
      case 'id':
        return (<div className="TT-column">{column}</div>);
      case 'address':
        return (<div className="TT-column"><Address address={column} textOnly={true}/></div>);
      case 'amount':
        return (<div className="TT-column right">{column}</div>);
      case 'payout':
        return (<div className="TT-column right">{this.getPayout(column)}</div>);
      case 'luckyNumber':
        let classColor = "green-label";
        if (selectors.red.indexOf(column) > -1) {
          classColor = "red-label";
        } else if (selectors.black.indexOf(column) > -1) {
          classColor = "black-label";
        }
        return (<div className="TT-column center"><label className={classColor}>{column}</label></div>);
      default:
        return (<div className="TT-column right"><a className="View-button" onClick={this.props.view.bind(this, column.id)}>view</a> </div>);

    }
  }

  getRow(row) {
    return (<div className="TT-row" key={row.id}>
      {this.getColumn(row.timestamp, 'time')}
      {this.getColumn(row.id, 'id')}
      {this.getColumn(row.senderId, 'address')}
      {this.getColumn(row.luckyNumber, 'luckyNumber')}
      {this.getColumn(new BigNum(row.amount).div(10 ** 8).toString(), 'amount')}
      {this.getColumn(row, 'payout')}
      {this.getColumn(row, 'view')}
    </div>);
  }

  renderRows() {
    return this.state.transactions.map(row => this.getRow(row));
  }

  render() {
    return (
      <div className="Transactions-table">
        <div className="TT-head">
          <div className="TT-row head">
            <div className="TTH-column">Time</div>
            <div className="TTH-column">ID</div>
            <div className="TTH-column">Player</div>
            <div className="TTH-column center">Lucky number</div>
            <div className="TTH-column right">Bet</div>
            <div className="TTH-column right">Payout</div>
            <div className="TTH-column right">Options</div>
          </div>
        </div>
        <div className="TT-body">
          {this.renderRows()}
        </div>
      </div>
    );
  }
}


export const TransactionTable = props => (
  <SocketContext.Consumer>
    {socket => <TransactionTableComponent {...props} socket={socket}/>}
  </SocketContext.Consumer>
);
