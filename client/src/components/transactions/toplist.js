import React from 'react';
import { SocketContext } from "../../actions/socket-context";
import { subscribeToStats, subscribeToTopList } from "../../actions/subscribe";
import { requestStats, requestTopList } from "../../actions/request";
import BigNum from 'bignumber.js';
import './toplist.css';

export class TopListComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stats: {
        bets: 0,
        wins: 0,
        payout: 0,
        wagered: 0,
      },
      topLists: {
        balance: [],
        bets: [],
        win: [],
      }
    };
    subscribeToTopList(props.socket, (err, res) => this.updateTopLists(res));
    subscribeToStats(props.socket, (err, res) => this.updateStats(res));
    requestStats(props.socket);
    requestTopList(props.socket);
  }

  updateTopLists(lists) {
    this.setState({
      topLists: lists
    });
  }

  updateStats(stats) {
    this.setState({
      stats: {
        bets: stats.bets,
        wins: stats.wins,
        payout: new BigNum(stats.payout).dividedBy(10 ** 8).toString(),
        wagered: new BigNum(stats.wagered).dividedBy(10 ** 8).toString(),
      }
    });
  }

  getRows(list) {
    let i = 0;
    return this.state.topLists[list].map(row => {
      console.log(row)
      let value = '';
      if (list === "balance") {
        value = new BigNum(row.balance).dividedBy(10 ** 8).toString();
      } else if (list === 'win') {
        value = row.wins;
      } else if (list === 'bets') {
        value = row.bets;
      }
      i++;
      return (<div className="TTL-row" key={`list-item-${list}-${row.username}`}>
        <div className="TTL-column">{i}</div>
        <div className="TTL-column">{row.username}</div>
        <div className="TTL-column">{value}</div>
      </div>);
    })
  }

  render() {
    return (
      <div className="TopList-container">
        <div className="TopAccounts">
          <h2>Top Players</h2>
          <div className="TopList-table">
            <div className="TTL-head">
              <div className="TTL-row head">
                <div className="TTLH-column">#</div>
                <div className="TTLH-column">Player</div>
                <div className="TTLH-column">Balance</div>
              </div>
            </div>
            <div className="TTL-body">
              {this.getRows('balance')}
            </div>
          </div>
        </div>
        <div className="MostBets">
          <h2>Most bets</h2>
          <div className="TopList-table">
            <div className="TTL-head">
              <div className="TTL-row head">
                <div className="TTLH-column">#</div>
                <div className="TTLH-column">Player</div>
                <div className="TTLH-column">Bets</div>
              </div>
            </div>
            <div className="TTL-body">
              {this.getRows('bets')}
            </div>
          </div>
        </div>
        <div className="MostWon">
          <h2>Most bets won</h2>
          <div className="TopList-table">
            <div className="TTL-head">
              <div className="TTL-row head">
                <div className="TTLH-column">#</div>
                <div className="TTLH-column">Player</div>
                <div className="TTLH-column">Bets won</div>
              </div>
            </div>
            <div className="TTL-body">
              {this.getRows('win')}
            </div>
          </div>
        </div>
        <div className="Stats">
          <h2>Statistics</h2>
          <div className="TopList-table">
            <div className="TTL-head">
              <div className="TTL-row head">
                <div className="TTLH-column">Key</div>
                <div className="TTLH-column">Total</div>
              </div>
            </div>
            <div className="TTL-body">
              <div className="TTL-row">
                <div className="TTL-column">Bets</div>
                <div className="TTL-column">{this.state.stats.bets}</div>
              </div>
              <div className="TTL-row">
                <div className="TTL-column">Wins</div>
                <div className="TTL-column">{this.state.stats.wins}</div>
              </div>
              <div className="TTL-row">
                <div className="TTL-column">Losses</div>
                <div className="TTL-column">{this.state.stats.bets - this.state.stats.wins}</div>
              </div>
              <div className="TTL-row">
                <div className="TTL-column">Wagered</div>
                <div className="TTL-column">{this.state.stats.wagered}</div>
              </div>
              <div className="TTL-row">
                <div className="TTL-column">Payout</div>
                <div className="TTL-column">{this.state.stats.payout}</div>
              </div>
             
          
              
            </div>

          </div>
           <div  className="socialBtn discord">Join Moosty discord</div>
            <div  className="socialBtn discord">Join Lisk discord</div>
           <div  className="socialBtn twitter">Follow Moosty on Twitter</div>
            <div  className="socialBtn github">Checkout Github</div>
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
