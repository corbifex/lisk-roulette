import React from 'react';
import './account.css';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { SocketContext } from "../../actions/socket-context";

export class AccountComponent extends React.Component {

  render() {
    let clearClass = "Disabled";
    return (
      <div className="Account-container">

        <div className="Account">
          <div className="Inner-Account"><span className="Inner-Account-title">Total balance:</span><br/>{this.props.account.balance && this.props.account.balance.toString()}</div>
          <div className="Inner-Account"><span className="Inner-Account-title">Unconfirmed Bet:</span><br/>{this.props.currentBet}</div>
          <div className="Inner-Account"><span className="Inner-Account-title">Confirmed Bet:</span><br/>{this.props.confirmedBet}</div>
           <div className="Inner-Account"><span className="Inner-Account-title">Win:</span><br/>{this.props.currentBet}</div>
        </div>
        <FormGroup row className="Form-group">
          {/*{!this.props.auto && this.props.confirmedBet === 0 && <FormControlLabel*/}
          {/*  control={*/}
          {/*    <Button className="active" onClick={this.props.confirm.bind(this)}*/}
          {/*            disabled={this.props.currentBet === 0 || this.props.state > 0}>Confirm</Button>*/}
          {/*  }*/}
          {/*  label=""*/}
          {/*/>}*/}
          <FormControlLabel
            control={
              <Button className={clearClass} disabled={this.props.currentBet === 0}
                      onClick={this.props.clear.bind(this)}>Clear</Button>
            }
            label=""
          />
          {/*<FormControlLabel*/}
          {/*  control={*/}
          {/*    <Switch*/}
          {/*      checked={this.props.repeat}*/}
          {/*      onChange={this.props.switchRepeat.bind(this)}*/}
          {/*      color="primary"*/}
          {/*    />*/}
          {/*  }*/}
          {/*  label="Repeat"*/}
          {/*/>*/}
          {/*{this.props.repeat && <FormControlLabel*/}
          {/*  control={*/}
          {/*    <Switch*/}
          {/*      checked={this.props.auto}*/}
          {/*      onChange={this.props.switchAuto.bind(this)}*/}
          {/*      color="primary"*/}
          {/*    />*/}
          {/*  }*/}
          {/*  label="Auto Confirm"*/}
          {/*/>}*/}
          {/*<FormControlLabel*/}
          {/*  control={*/}
          {/*    <Switch*/}
          {/*      checked={this.props.showPeers}*/}
          {/*      onChange={this.props.switchPeers.bind(this)}*/}
          {/*      color="primary"*/}
          {/*    />*/}
          {/*  }*/}
          {/*  label="Show peer bets"*/}
          {/*/>*/}
        </FormGroup>
      </div>
    );
  }
}


export const Account = props => (
  <SocketContext.Consumer>
    {socket => <AccountComponent {...props} socket={socket} />}
  </SocketContext.Consumer>
);

