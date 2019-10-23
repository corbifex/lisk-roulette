import React from 'react';
import { Mnemonic } from '@liskhq/lisk-passphrase';
import { getAddressAndPublicKeyFromPassphrase } from '@liskhq/lisk-cryptography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './login.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Address } from "../address";


export class Login extends React.Component {
  constructor(props) {
    super(props);
    const passphrase = Mnemonic.generateMnemonic();
    const address = getAddressAndPublicKeyFromPassphrase(passphrase);
    this.state = {
      login: false,
      publicKey: address.publicKey,
      address: address.address,
      passphrase: passphrase,
      tokenText: "Get Tokens",
    }
  }

  login() {
    this.props.login(this.state.passphrase);
    this.setState({login: false});
  }

  getNewPassphrase() {
    const passphrase = Mnemonic.generateMnemonic();
    this.updatePassphrase(passphrase);
  }

  updatePassphrase(passphrase) {
    const address = getAddressAndPublicKeyFromPassphrase(passphrase);
    this.setState({
      passphrase: passphrase,
      publicKey: address.publicKey,
      address: address.address
    });
  }

  toggleDrawer(side, open) {
    if (side === 'login') {
      this.getNewPassphrase();
      this.setState({login: open});
    }
  }

  getTokens() {
    this.props.requestTokens();
    if (this.state.tokenText === "Get Tokens") {
      this.setState({tokenText: "Counting your bucks!"});
    } else {
      this.setState({tokenText: "I'm counting chill!!"});
    }
    setTimeout(() => {
      this.setState({tokenText: "Get Tokens"});
    }, 10000);
  }

  render() {
    return (
      <div className="top-header">
        <div className="Login-container">
          {!this.props.loggedIn &&
          <Button variant="contained" color="primary" onClick={this.toggleDrawer.bind(this, 'login', true)}>
            Login
          </Button>}
          {this.props.loggedIn && <Button variant="contained" color="primary" onClick={this.props.logout.bind(this)}>
            Logout
          </Button>}
          {this.props.loggedIn && this.props.account.balance.lt(10) && !this.props.account.balance.eq(-1) &&
          <Button variant="contained" color="primary" onClick={this.getTokens.bind(this)}>
            {this.state.tokenText}
          </Button>}
          {/*<Button variant="contained" color="primary">*/}
          {/*  See Transactions*/}
          {/*</Button>*/}
        </div>
        <SwipeableDrawer
          anchor="top"
          open={this.state.login}
          onClose={this.toggleDrawer.bind(this, 'login', false)}
          onOpen={this.toggleDrawer.bind(this, 'login', true)}
        >
          <div className="Login-drawer">
            <div className="Login-flex">
              <Button variant="contained" color="primary" onClick={this.getNewPassphrase.bind(this)}>
                New passpharse
              </Button>
              <TextField
                id="standard-name"
                label="Passphrase"
                className="Login-field"
                value={this.state.passphrase}
                margin="normal"
                onChange={(input) => this.updatePassphrase(input.target.value)}
              />
              <CopyToClipboard text={this.state.passphrase}>
                <Button variant="contained" color="primary">
                  Copy passphrase
                </Button>
              </CopyToClipboard>
            </div>
            <div className="Login-address">
              Address: {this.state.address} <br/>
              <Address address={this.state.address}/> <br/>
              <Button variant="contained" color="primary" onClick={this.login.bind(this)}>
                Login
              </Button>
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}
