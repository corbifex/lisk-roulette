import React from 'react';
import { Loading } from './components/loading';
import { Login } from './components/login';
import { Table } from './components/table';
import { Transactions } from './components/transactions';
import { Lastnumbers } from './components/lastnumbers';
import './App.css';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
    setTimeout(() => this.updateLoaded(), 100);
  }

  subscribeToSever() {
  }

  updateLoaded() {
    if (!this.state.loaded) {
      this.setState({loaded: true});
    }
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
            <Lastnumbers/>
            <Transactions/>
          </div>}
      </div>
    );
  }
}
