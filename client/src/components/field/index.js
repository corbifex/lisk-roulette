import React from 'react';
import ReplayIcon from '@material-ui/icons/Replay';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IconButton from "@material-ui/core/IconButton";
import { SocketContext } from "../../actions/socket-context";
import { Zoom } from "../zoom";
import { Tokens } from "../table/tokens";

import './field.css';

export class FieldComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rolledNumber: 0,
      fields: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 'row1', 'row2', 'row3',
        'first', 'second', 'third', 'half1', 'even', 'red', 'black', 'odd', 'half2'
      ],
      selectors: {
        red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
        black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
        first: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        second: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        third: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
        row3: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
        row2: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        row1: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        half1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        half2: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
        odd: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
        even: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
      },
      betCount: 0,
      confirmedCount: 0,
      userBets: [],
      confirmedBets: [],
      tokens: [
        1,
        5,
        25,
        50,
        100,
        500,
      ],
      state: 0,
    };
    this.selector = new Array(50);
    for (let i = 0; i <= 50; i++) {
      this.selector[i] = React.createRef();
    }
  }

  updateStatus(status) {
    if (this.state.state !== status) {
      if (status === 0) {
        this.setState({state: 0, peerCount: 0, peerBets: []});
      } else if (status === 1) {
        this.setState({state: 1});

      } else if (status === 2) {
        this.setState({state: 2});
      } else if (status === 3) {
        this.setState({state: 3});
      }
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let state = {betCount: this.state.betCount, userBets: this.state.userBets};
    let stateConfirmed = {confirmedCount: this.state.confirmedCount, confirmedBets: this.state.confirmedBets};
    if (nextProps.userBets && nextProps.userBets.length > 0) {
      let userBets = [];
      for (let i = 0; i < nextProps.userBets.length; i++) {
        const index = this.state.fields.indexOf(nextProps.userBets[i].field);
        const rect = this.selector[index].current.getBoundingClientRect();
        const x = this.selector[index].current.offsetLeft + (rect.width / (rect.width > 110 ? 1.7 : 1.05));
        const y = this.selector[index].current.offsetTop + (rect.height / (rect.height > 100 ? 1.5 : 0.95));
        userBets = [...userBets, {
          field: nextProps.userBets[i].field,
          x: x,
          y: y,
          amount: nextProps.userBets[i].amount
        }];
      }
      state = {betCount: nextProps.userBets.length, userBets: userBets};
    }
    if (!nextProps.userBets || (nextProps.userBets && nextProps.userBets.length === 0)) {
      state = {betCount: 0, userBets: []};
    }
    if (nextProps.confirmedBets && nextProps.confirmedBets.length > 0) {
      let confirmedBets = [];
      for (let i = 0; i < nextProps.confirmedBets.length; i++) {
        const index = nextProps.confirmedBets[i].field;
        const rect = this.selector[index].current.getBoundingClientRect();
        const x = this.selector[index].current.offsetLeft + (rect.width / (rect.width > 110 ? 1.7 : 1.05));
        const y = this.selector[index].current.offsetTop + (rect.height / (rect.height > 100 ? 1.5 : 0.95));
        confirmedBets = [...confirmedBets, {
          field: nextProps.confirmedBets[i].field,
          x: x,
          y: y,
          amount: nextProps.confirmedBets[i].amount
        }];
      }
      stateConfirmed = {confirmedCount: nextProps.confirmedBets.length, confirmedBets: confirmedBets};
    }
    if (!nextProps.confirmedBets || (nextProps.confirmedBets && nextProps.confirmedBets.length === 0)) {
      stateConfirmed = {confirmedCount: 0, confirmedBets: []};
    }

    this.setState({...state, ...stateConfirmed});
  }

  mouseOver(field) {
    this.setState({hover: field});
  }

  getClass(field, type) {
    let classname = "";
    if (typeof field === "number") {
      classname += "num ";
    }
    if (field === 0) {
      classname += "green zero ";
    }

    if (this.state.selectors.red.indexOf(field) > -1 || field === "red") {
      classname += "red "
    }

    if (this.state.selectors.black.indexOf(field) > -1 || field === "black") {
      classname += "black "
    }

    if (type === 'sector') {
      classname += "sector ";
    }

    if (this.state.state === 0 && this.props.loggedIn && this.state.hover === field) {
      classname += "hover ";
    }

    if (this.state.state === 0 && this.props.loggedIn && this.state.hover && typeof this.state.hover !== "number") {
      if (this.state.selectors[this.state.hover].indexOf(field) > -1) {
        classname += "hover ";
      }
    }

    if (this.props.state === 2) {
      if (typeof field === "number" && this.props.rolledNumber === field) {
        classname += "hover ";
      }
      if (typeof field === "string" && this.state.selectors[field].indexOf(this.props.rolledNumber) > -1) {
        classname += "hover ";
      }
    }

    if (this.props.account.balance.eq(-1)) {
      classname += " disabled";
    }

      return classname;
  }

  renderUserBets() {
    let bets = [];
    if (this.state.betCount === 0) {
      return "";
    }
    for (let i = 0; i < this.state.betCount; i++) {
      const key = `token-field-${i}`;
      bets = [...bets, (<div style={{
        position: 'absolute',
        top: `${this.state.userBets[i].y}px`,
        left: `${this.state.userBets[i].x}px`,
        zIndex: 100,
        cursor: "crosshair",
      }} className="Token-field" key={key}
                             onClick={this.props.clickField.bind(this, this.state.userBets[i].field)}>{this.state.userBets[i].amount}</div>)];
    }
    return bets;
  }

  renderConfirmedBets() {
    let bets = [];
    if (this.state.confirmedCount === 0) {
      return "";
    }
    for (let i = 0; i < this.state.confirmedCount; i++) {
      const key = `token-field-confirmed-${i}`;
      bets = [...bets, (<div style={{
        position: 'absolute',
        top: `${this.state.confirmedBets[i].y}px`,
        left: `${this.state.confirmedBets[i].x}px`,
        zIndex: 100,
        cursor: "crosshair",
        filter: "greyscale(0.5) blur(0) contrast(5)",

      }} className="Token-field" key={key}
                             onClick={this.props.clickField.bind(this, this.state.confirmedBets[i].field)}>{this.state.confirmedBets[i].amount}</div>)];
    }
    return bets;
  }

  render() {
    let containerClass = "Field-container ";
    if (this.props.account.balance.eq(-1)) {
      containerClass += "Field-container-disabled";
    }
    return (
      <div ref={this.selector[50]} className={containerClass}>
        {this.renderUserBets()}
        {this.renderConfirmedBets()}
        <table onMouseOut={this.mouseOver.bind(this, null)}>
          <tbody>
          <tr className="nums">
            <td
              ref={this.selector[0]}
              onClick={this.props.clickField.bind(this, 0)}
              className={this.getClass(0)}
              rowSpan="3"
              onMouseOver={this.mouseOver.bind(this, 0)}><span> 0 </span>
            </td>
            <td
              ref={this.selector[3]}
              onClick={this.props.clickField.bind(this, 3)}
              className={this.getClass(3)}
              onMouseOver={this.mouseOver.bind(this, 3)}><span> 3 </span></td>
            <td
              ref={this.selector[6]}
              onClick={this.props.clickField.bind(this, 6)}
              className={this.getClass(6)}
              onMouseOver={this.mouseOver.bind(this, 6)}><span> 6 </span></td>
            <td
              ref={this.selector[9]}
              onClick={this.props.clickField.bind(this, 9)}
              className={this.getClass(9)}
              onMouseOver={this.mouseOver.bind(this, 9)}><span> 9 </span></td>
            <td
              ref={this.selector[12]}
              onClick={this.props.clickField.bind(this, 12)}
              className={this.getClass(12)}
              onMouseOver={this.mouseOver.bind(this, 12)}><span> 12 </span></td>
            <td
              ref={this.selector[15]}
              onClick={this.props.clickField.bind(this, 15)}
              className={this.getClass(15)}
              onMouseOver={this.mouseOver.bind(this, 15)}><span> 15 </span></td>
            <td
              ref={this.selector[18]}
              onClick={this.props.clickField.bind(this, 18)}
              className={this.getClass(18)}
              onMouseOver={this.mouseOver.bind(this, 18)}><span> 18 </span></td>
            <td
              ref={this.selector[21]}
              onClick={this.props.clickField.bind(this, 21)}
              className={this.getClass(21)}
              onMouseOver={this.mouseOver.bind(this, 21)}><span> 21 </span></td>
            <td
              ref={this.selector[24]}
              onClick={this.props.clickField.bind(this, 24)}
              className={this.getClass(24)}
              onMouseOver={this.mouseOver.bind(this, 24)}><span> 24 </span></
              td>
            <td
              ref={this.selector[27]}
              onClick={this.props.clickField.bind(this, 27)}
              className={this.getClass(27)}
              onMouseOver={this.mouseOver.bind(this, 27)}><span> 27 </span></td>
            <td
              ref={this.selector[30]}
              onClick={this.props.clickField.bind(this, 30)}
              className={this.getClass(30)}
              onMouseOver={this.mouseOver.bind(this, 30)}><span> 30 </span></td>
            <td
              ref={this.selector[33]}
              onClick={this.props.clickField.bind(this, 33)}
              className={this.getClass(33)}
              onMouseOver={this.mouseOver.bind(this, 33)}><span> 33 </span></td>
            <td
              ref={this.selector[36]}
              onClick={this.props.clickField.bind(this, 36)}
              className={this.getClass(36)}
              onMouseOver={this.mouseOver.bind(this, 36)}><span> 36 </span></td>
            <td
              ref={this.selector[37]}
              onClick={this.props.clickField.bind(this, 'row1')}
              className={this.getClass('row1', 'sector')}
              onMouseOver={this.mouseOver.bind(this, 'row1')}>
              <span className="vt"> 2 to 1 </span>
            </td>
          </tr>
          <tr className="nums">
            <td className="hidden"/>
            <td ref={this.selector[2]} onClick={this.props.clickField.bind(this, 2)} className={this.getClass(2)}
                onMouseOver={this.mouseOver.bind(this, 2)}><span>2</span></td>
            <td ref={this.selector[5]} onClick={this.props.clickField.bind(this, 5)} className={this.getClass(5)}
                onMouseOver={this.mouseOver.bind(this, 5)}><span>5</span></td>
            <td ref={this.selector[8]} onClick={this.props.clickField.bind(this, 8)} className={this.getClass(8)}
                onMouseOver={this.mouseOver.bind(this, 8)}><span>8</span></td>
            <td ref={this.selector[11]} onClick={this.props.clickField.bind(this, 11)} className={this.getClass(11)}
                onMouseOver={this.mouseOver.bind(this, 11)}><span>11</span></td>
            <td ref={this.selector[14]} onClick={this.props.clickField.bind(this, 14)} className={this.getClass(14)}
                onMouseOver={this.mouseOver.bind(this, 14)}><span>14</span></td>
            <td ref={this.selector[17]} onClick={this.props.clickField.bind(this, 17)} className={this.getClass(17)}
                onMouseOver={this.mouseOver.bind(this, 17)}><span>17</span></td>
            <td ref={this.selector[20]} onClick={this.props.clickField.bind(this, 20)} className={this.getClass(20)}
                onMouseOver={this.mouseOver.bind(this, 20)}><span>20</span></td>
            <td ref={this.selector[23]} onClick={this.props.clickField.bind(this, 23)} className={this.getClass(23)}
                onMouseOver={this.mouseOver.bind(this, 23)}><span>23</span></td>
            <td ref={this.selector[26]} onClick={this.props.clickField.bind(this, 26)} className={this.getClass(26)}
                onMouseOver={this.mouseOver.bind(this, 26)}><span>26</span></td>
            <td ref={this.selector[29]} onClick={this.props.clickField.bind(this, 29)} className={this.getClass(29)}
                onMouseOver={this.mouseOver.bind(this, 29)}><span>29</span></td>
            <td ref={this.selector[32]} onClick={this.props.clickField.bind(this, 32)} className={this.getClass(32)}
                onMouseOver={this.mouseOver.bind(this, 32)}><span>32</span></td>
            <td ref={this.selector[35]} onClick={this.props.clickField.bind(this, 35)} className={this.getClass(35)}
                onMouseOver={this.mouseOver.bind(this, 35)}><span>35</span></td>
            <td ref={this.selector[38]} onClick={this.props.clickField.bind(this, 'row2')}
                className={this.getClass('row2', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'row2')}><span
              className="vt">2 to 1</span></td>
          </tr>
          <tr
            className="nums">
            <td
              className="hidden"/>
            <td
              ref={this.selector[1]}
              onClick={this.props.clickField.bind(this, 1)}
              className={this.getClass(1)}
              onMouseOver={this.mouseOver.bind(this, 1)}><span> 1 </span>
            </td>
            <td
              ref={this.selector[4]}
              onClick={this.props.clickField.bind(this, 4)}
              className={this.getClass(4)}
              onMouseOver={this.mouseOver.bind(this, 4)}><span> 4 </span></
              td>
            <td
              ref={this.selector[7]}
              onClick={this.props.clickField.bind(this, 7)}
              className={this.getClass(7)}
              onMouseOver={this.mouseOver.bind(this, 7)}><span> 7 </span></td>
            <td
              ref={this.selector[10]}
              onClick={this.props.clickField.bind(this, 10)}
              className={this.getClass(10)}
              onMouseOver={this.mouseOver.bind(this, 10)}><span> 10 </span></td>
            <td
              ref={this.selector[13]}
              onClick={this.props.clickField.bind(this, 13)}
              className={this.getClass(13)}
              onMouseOver={this.mouseOver.bind(this, 13)}><span> 13 </span></td>
            <td
              ref={this.selector[16]}
              onClick={this.props.clickField.bind(this, 16)}
              className={this.getClass(16)}
              onMouseOver={this.mouseOver.bind(this, 16)}><span> 16 </span></td>
            <td
              ref={this.selector[19]}
              onClick={this.props.clickField.bind(this, 19)}
              className={this.getClass(19)}
              onMouseOver={this.mouseOver.bind(this, 19)}><span> 19 </span></td>
            <td
              ref={this.selector[22]}
              onClick={this.props.clickField.bind(this, 22)}
              className={this.getClass(22)}
              onMouseOver={this.mouseOver.bind(this, 22)}><span> 22 </span></td>
            <td
              ref={this.selector[25]}
              onClick={this.props.clickField.bind(this, 25)}
              className={this.getClass(25)}
              onMouseOver={this.mouseOver.bind(this, 25)}><span> 25 </span></td>
            <td
              ref={this.selector[28]}
              onClick={this.props.clickField.bind(this, 28)}
              className={this.getClass(28)}
              onMouseOver={this.mouseOver.bind(this, 28)}><span> 28 </span></td>
            <td
              ref={this.selector[31]}
              onClick={this.props.clickField.bind(this, 31)}
              className={this.getClass(31)}
              onMouseOver={this.mouseOver.bind(this, 31)}><span> 31 </span></td>
            <td
              ref={this.selector[34]}
              onClick={this.props.clickField.bind(this, 34)}
              className={this.getClass(34)}
              onMouseOver={this.mouseOver.bind(this, 34)}><span> 34 </span></td>
            <td
              ref={this.selector[39]}
              onClick={this.props.clickField.bind(this, 'row3')}
              className={this.getClass('row3', 'sector')}
              onMouseOver={this.mouseOver.bind(this, 'row3')}><span className="vt">2 to 1</span></td>
          </tr>
          <tr>
            <td className="empty"/>
            <td ref={this.selector[40]} onClick={this.props.clickField.bind(this, 'first')} colSpan="4"
                className={this.getClass('first', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'first')}>1st 12
            </td>
            <td ref={this.selector[41]} onClick={this.props.clickField.bind(this, 'second')} colSpan="4"
                className={this.getClass('second', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'second')}>2nd 12
            </td>
            <td ref={this.selector[42]} onClick={this.props.clickField.bind(this, 'third')} colSpan="4"
                className={this.getClass('third', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'third')}>3rd 12
            </td>
            <td className="empty"/>
          </tr>
          <tr>
            <td
              className="empty">
              <IconButton onClick={this.props.repeat.bind(this)} aria-label="view" className="View-icon"
                          style={{color: 'white'}}>
                <ReplayIcon/>
              </IconButton>
            </td>
            <td
              ref={this.selector[43]}
              onClick={this.props.clickField.bind(this, 'half1')}
              colSpan="2"
              className={this.getClass('half1', 'sector')}
              onMouseOver={this.mouseOver.bind(this, 'half1')}> 1 to 18
            </td>
            <td ref={this.selector[44]} onClick={this.props.clickField.bind(this, 'even')} colSpan="2"
                className={this.getClass('even', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'even')}>EVEN
            </td>
            <td
              ref={this.selector[45]}
              onClick={this.props.clickField.bind(this, 'red')}
              colSpan="2"
              className={this.getClass('red', 'sector')}
              onMouseOver={this.mouseOver.bind(this, 'red')}> RED
            </td>
            <td ref={this.selector[46]} onClick={this.props.clickField.bind(this, 'black')} colSpan="2"
                className={this.getClass('black', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'black')}>BLACK
            </td>
            <td
              ref={this.selector[47]}
              onClick={this.props.clickField.bind(this, 'odd')}
              colSpan="2"
              className={this.getClass('odd', 'sector')}
              onMouseOver={this.mouseOver.bind(this, 'odd')}> ODD
            </td>
            <td ref={this.selector[48]} onClick={this.props.clickField.bind(this, 'half2')}
                colSpan="2"
                className={this.getClass('half2', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'half2')}>19 to 36
            </td>
            <td className="empty">
              <IconButton onClick={this.props.clear.bind(this)} aria-label="view" className="View-icon"
                          style={{color: 'white'}}>
                <DeleteForeverIcon/>
              </IconButton>
            </td>
          </tr>
          </tbody>
        </table>
        {this.props.loggedIn &&
        <Tokens setAmount={this.props.setAmount.bind(this)} balance={this.props.account.balance} bet={this.state.userBets}
        />}
        {this.props.loggedIn &&
        <Zoom zoom={this.props.zoom.bind(this)}/>}
      </div>
    );
  }
}

export const Field = props => (
  <SocketContext.Consumer>
    {socket => <FieldComponent {...props} socket={socket}/>}
  </SocketContext.Consumer>
);
