import React from 'react';
import Prando from 'prando';
import { subscribeToBlocks, subscribeToStatus } from '../../actions/subscribe';
import { requestBlocks } from '../../actions/request';
import './lastnumbers.css';
import { SocketContext } from "../../actions/socket-context";

export class LastNumbersComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { draws: [], state: 3 };
    requestBlocks( props.socket,(err, blockSignature) => this.updateBlocks(blockSignature));
    subscribeToBlocks( props.socket,(err, blockSignature) => this.updateBlock(blockSignature));
    subscribeToStatus( props.socket, (err, status) => this.updateStatus(status));

  }

  updateStatus(status) {
    if (this.state.state !== status) {
      if (status === 0) {
        this.setState({ state: 0 });
      } else if (status === 1) {
        this.setState({ state: 1 });
      } else if (status === 2) {
        this.setState({ state: 2 });
      } else if (status === 3) {
        this.setState( { state: 3 });
      }
    }
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
      draws = [...draws, draw];
    }
    this.setState({draws: draws});
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
      numbers = [ ...numbers, (<div key={key} className={classname}>{this.state.draws[i]}</div>)];
    }
    if (this.state.state !== 2) {
      numbers.pop();
      numbers = [(<div key='last-roll-live' className="singlenumber live hoverLive">?</div>), ...numbers];
    }
    return numbers;
  }

  render() {
    return (
      <div className="numberscontainer">
        {this.state.draws.length > 0 &&
         this.renderBlocks()
        }
      </div>

    )
  }
};

export const LastNumbers = props => (
  <SocketContext.Consumer>
    {socket => <LastNumbersComponent {...props} socket={socket} />}
  </SocketContext.Consumer>
);
