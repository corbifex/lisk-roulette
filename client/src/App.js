import React from 'react';
import { Loading } from './components/loading';
import { Login } from './components/login';
import { FaucetButton } from './components/faucetButton';
import { Table } from './components/table';
import { Transactions } from './components/transactions';

  import Button from '@material-ui/core/Button';


import './App.css';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };

    setTimeout(() => this.updateLoaded(), 1000);
  }

  updateLoaded() {
    this.setState({loaded: true});
  }

  render() {
    return (
      <div className="App">
        {!this.state.loaded &&
        <Loading/>
        }
        {this.state.loaded &&
        <div className="Loaded-app">
          <Login/>
          
          <Table/>
          <Transactions/>
        </div>

        }
      </div>

    );
  }
}
