import React from 'react';
import Prando from 'prando';
import { subscribeToBlocks } from '../../actions/subscribe';
import { requestBlocks } from '../../actions/request';
import './lastnumbers.css';

export class Lastnumbers extends React.Component {

  constructor(props) {
    super(props);
    this.state = { draws: [] };
    requestBlocks((err, blockSignature) => this.updateBlocks(blockSignature))
    subscribeToBlocks((err, blockSignature) => this.updateBlock(blockSignature));
  }

  updateBlock(blockSignature) {
    const rng = new Prando(blockSignature);
    const draw = rng.nextInt(0, 36);
    const draws = [draw, ...this.state.draws];
    if (draws.length > 10) {
      draws.pop();
    }
    setTimeout(() => {
      this.setState({draws: draws});
    }, 2100);
  }

  updateBlocks(blocks) {
    let draws = [];
    for (let i = 0; i < 10; i++) {
      const rng = new Prando(blocks[i]);
      const draw = rng.nextInt(0, 36);
      draws = [draw, ...draws];
      this.setState({draws: draws});
    }
  }

  renderBlocks() {
    const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    let numbers = [];
    for (let i = 0; i < 10 && i < this.state.draws.length; i++) {
      let classname = `singlenumber `;
      if (red.indexOf(this.state.draws[i]) > -1) {
        classname += 'red';
      } else if (this.state.draws[i] === 0) {
        classname += 'green';
      } else {
        classname += 'black';
      }
      const key = `last-roll-${i}`;
      numbers.push(<div key={key} className={classname}>{this.state.draws[i]}</div>)
    }
    return numbers;
  }

  render() {
    console.log(this.state.draws);
    return (
      <div className="numberscontainer">
        {this.state.draws.length > 0 &&
         this.renderBlocks()
        }
      </div>

    )
  }
};
