import React from 'react';
import './account.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Checkbox from '@material-ui/core/Checkbox';


export class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {saldo: 0, current: 0, confirmed: "(unconfirmed)"};
  }

  confirm() {
    this.setState({confirmed: "(Confirmed)"});
  }


  render() {
    return (
      <div className="Account-container">
        <div className="Saldo">Total: {this.state.saldo} Tokens</div>
        <div className="Current-bet">Current Bet: {this.props.currentBet} Tokens</div>
        <Grid item xs={12} md={6}>
          <ButtonGroup fullWidth aria-label="full width secondary contained button group">
            <Button className="active" onClick={this.confirm.bind(this)}>Confirm</Button>
            <Button >Repeat</Button>
            <Button >Clear</Button>
          </ButtonGroup>
        </Grid>
      </div>
    );
  }
}
