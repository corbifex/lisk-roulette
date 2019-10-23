import React from 'react';
import Prando from 'prando';
const names = require('./names');

export class Address extends React.Component {

  getName(address) {
    const rng = new Prando(address);
    const top = rng.nextInt(0, names.length - 1);
    let selections = names[top][0];
    let first = 0;
    let last = 0;
    for (let secN = 0; secN < selections.length; secN++) {
      if (selections[secN] === 0) {
        first++;
      } else {
        last++;
      }
    }

    const firstSection = names[top][rng.nextInt(1, first)];
    const lastSection = names[top][rng.nextInt(first + 1, first + last)];
    let firstName = "";
    for (let firstN = 0; firstN < firstSection.length; firstN++) {
      firstName += firstSection[firstN][rng.nextInt(0, firstSection[firstN].length)];
    }
    let lastname = "";
    for (let lastN = 0; lastN < lastSection.length; lastN++) {
      lastname += lastSection[lastN][rng.nextInt(0, lastSection[lastN].length)];
    }

    return `${firstName} ${lastname}`;
  }

  render() {
    if (this.props.textOnly) {
      return this.getName(this.props.address);
    }
    return (
      <div>Name: {this.getName(this.props.address)}</div>
    );
  }
}
