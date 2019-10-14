import React from 'react';
import './login.css';
  import Button from '@material-ui/core/Button';

export class Login extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="top-header">
        <div className="Login-container">
        <Button variant="contained" color="primary">
      Login 
    </Button>
    <Button variant="contained" color="primary">
      Get Tokens 
    </Button>
    <Button variant="contained" color="primary">
      See Transactions
    </Button>
        </div>
      </div>
    );
  }
}
