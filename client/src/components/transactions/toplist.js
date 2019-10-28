import React from 'react';
import { SocketContext } from "../../actions/socket-context";
import './toplist.css';

export class TopListComponent extends React.Component {

  render() {
    return (
      <div className="Transactions-table">
        <div className="TT-head">
          <div className="TT-row head">
            <div className="TTH-column">Time</div>
            <div className="TTH-column">ID</div>
            <div className="TTH-column">Player</div>
            <div className="TTH-column center">Lucky number</div>
            <div className="TTH-column right">Bet</div>
            <div className="TTH-column right">Payout</div>
            <div className="TTH-column right">Options</div>
          </div>
        </div>
        <div className="TT-body">
          <div className="TT-row">
            <div className="TT-column"/>
            <div className="TT-column"/>
            <div className="TT-column"/>
            <div className="TT-column"/>
            <div className="TT-column"/>
            <div className="TT-column"/>
          </div>
        </div>
      </div>
    );
  }
}

export const TopList = props => (
  <SocketContext.Consumer>
    {socket => <TopListComponent {...props} socket={socket}/>}
  </SocketContext.Consumer>
);
