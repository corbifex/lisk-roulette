import React from 'react';
import { Dots } from "./dots";
import logo from '../../assets/images/roulette-photo01.jpg';
import './loading.css'

export class Loading extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Lisk roulette logo"/>
        <p className="Loading">
          Loading Lisk Roulette<Dots/>
        </p>
      </header>
    );
  }
}
