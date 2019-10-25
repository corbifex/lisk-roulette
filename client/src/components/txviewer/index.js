import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { SocketContext } from "../../actions/socket-context";
import { requestTx } from '../../actions/request';
import { TxViewerTable } from './table';
import './txviewer.css';
import Prando from "prando";
import { fields, multiplier, selectors } from "../../transactions/1001_bet_roulette";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export class TxViewerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: true, profit: 0};
    requestTx(props.id, props.socket, (err, tx) => this.setTx(tx));
  }

  componentWillUnmount() {
    this.props.socket.removeListener(this.props.id);
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

  setTx(tx) {
    this.setState({
      bet: JSON.parse(tx.asset.data),
      profit: this.profit(JSON.parse(tx.asset.data), this.getLuckyNumber(tx.seed)),
      luckyNumber: this.getLuckyNumber(tx.seed)
    });
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

  handleClose() {
    this.props.view(0);
  }

  render() {
    return (
      <Dialog
        onClick={this.handleClose.bind(this)}
        open={this.state.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleClose.bind(this)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Transaction {this.props.id}</DialogTitle>
        <DialogTitle>Payout: {this.state.profit}</DialogTitle>
        <DialogContent>
            <TxViewerTable luckyNumber={this.state.luckyNumber} state={this.state} />
        </DialogContent>
      </Dialog>

    )
  }
};

export const TxViewer = props => (
  <SocketContext.Consumer>
    {socket => <TxViewerComponent {...props} socket={socket}/>}
  </SocketContext.Consumer>
);
