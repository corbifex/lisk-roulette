import React from 'react';
import Prando from 'prando';
import { fields, multiplier, selectors } from '../../transactions/1001_bet_roulette';
import { subscribeToResults } from '../../actions/subscribe';
import { requestResult } from '../../actions/request';
import { Address } from "../address";
import './table.css';
import { SocketContext } from "../../actions/socket-context";
const BigNum = require('bignumber.js');

export class TransactionTableComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      transactions: [],
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
    } else {
      setTimeout(() => {
        this.addBlock(block);
      }, 8000);
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
            }
          }
        }
      }
      this.setState({blocks: blocks, transactions: txs})
    }
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
      case 'id':
        return (<div className="TT-column">{column}</div>);
      case 'address':
        return (<div className="TT-column"><Address address={column} textOnly={true}/></div>);
      case 'amount':
        return (<div className="TT-column right">{column}</div>);
      case 'payout':
        return (<div className="TT-column right">{this.getPayout(column)}</div>);
      case 'luckyNumber':
        return (<div className="TT-column center">{column}</div>);
      default:
        return (<div className="TT-column right">-</div>);

    }
  }

  getRow(row) {
    return (<div className="TT-row" key={row.id}>
      {this.getColumn(row.id, 'id')}
      {this.getColumn(row.senderId, 'address')}
      {this.getColumn(row.luckyNumber, 'luckyNumber')}
      {this.getColumn(new BigNum(row.amount).div(10 ** 8).toString(), 'amount')}
      {this.getColumn(row, 'payout')}
      {this.getColumn('', 'view')}
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
