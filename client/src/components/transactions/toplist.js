import React from 'react';
import { SocketContext } from "../../actions/socket-context";
import './toplist.css';

export class TopListComponent extends React.Component {

  render() {
    return (
      <div className="Transactions-table">
        <div className="TT-head">
          <div className="TT-row head">
         
            <div className="TTH-column">Position</div>
            <div className="TTH-column">Player</div>            
            <div className="TTH-column right">Total Wagered</div>
            <div className="TTH-column right">Total Profit</div>
            <div className="TTH-column right">Bets</div>
            <div className="TTH-column right">Wins</div>
            <div className="TTH-column right">Losses</div>

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