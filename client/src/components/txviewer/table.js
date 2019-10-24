import React from 'react';
import './txviewer.css';
import token1 from "../../assets/images/1.png";
import token5 from "../../assets/images/5.png";
import token25 from "../../assets/images/25.png";

export class TxViewerTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
      tokens: {
        1: token1,
        5: token5,
        25: token25,
      },
      state: 0,
    };
    this.selector = new Array(50);
    for (let i = 0; i <= 50; i++) {
      this.selector[i] = React.createRef();
    }
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

    if (typeof field === "number" && this.props.luckyNumber === field) {
      classname += "hover ";
    }
    if (typeof field === "string" && this.state.selectors[field].indexOf(this.props.luckyNumber) > -1) {
      classname += "hover ";
    }

    return classname;
  }

  splitToTokens(amount, tokens) {
    if (amount === 0) {
      return [];
    } else {
      if (amount >= tokens[0]) {
        let left = amount - tokens[0];
        return [tokens[0]].concat(this.splitToTokens(left, tokens));
      } else {
        tokens.shift();
        return this.splitToTokens(amount, tokens);
      }
    }
  }

  renderUserBets() {
    let bets = [];
    let j = 0;
    for (let i = 0; i < this.props.state.bet.length; i++) {
      const index = this.props.state.bet[i].field;
      const rect = this.selector[index].current.getBoundingClientRect();

      const bet = this.splitToTokens(parseInt(this.props.state.bet[i].amount), [25,5,1]);
      bet.map(tk => {
        console.log(tk)
        j++;
        const x = this.selector[index].current.offsetLeft + 50 + rInt(-10, rect.width - 35 );
        const y = this.selector[index].current.offsetTop + 50 + rInt(-10, rect.height - 35);
        const key = `token-field-${i}-${j}`;
        bets = [...bets, (<img style={{
          position: 'absolute',
          top: `${y}px`,
          left: `${x}px`,
          zIndex: 100,
          height: "25px",
          width: "25px",
          cursor: "crosshair",
        }} src={this.state.tokens[tk.toString()]} alt="" key={key}/>)];
      })
    }
    return bets;
  }

  render() {
    return (
      <div ref={this.selector[50]} className="Field-container-tx">
        {this.props.state.bet && this.renderUserBets()}
        <table>
          <tbody>
          <tr className="nums">
            <td
              ref={this.selector[0]}
              className={this.getClass(0)}
              rowSpan="3"><span> 0 </span>
            </td>
            <td
              ref={this.selector[3]}
              className={this.getClass(3)}><span> 3 </span></td>
            <td
              ref={this.selector[6]}
              className={this.getClass(6)}><span> 6 </span></td>
            <td
              ref={this.selector[9]}
              className={this.getClass(9)}><span> 9 </span></td>
            <td
              ref={this.selector[12]}
              className={this.getClass(12)}><span> 12 </span></td>
            <td
              ref={this.selector[15]}
              className={this.getClass(15)}><span> 15 </span></td>
            <td
              ref={this.selector[18]}
              className={this.getClass(18)}><span> 18 </span></td>
            <td
              ref={this.selector[21]}
              className={this.getClass(21)}><span> 21 </span></td>
            <td
              ref={this.selector[24]}
              className={this.getClass(24)}><span> 24 </span></
              td>
            <td
              ref={this.selector[27]}
              className={this.getClass(27)}><span> 27 </span></td>
            <td
              ref={this.selector[30]}
              className={this.getClass(30)}><span> 30 </span></td>
            <td
              ref={this.selector[33]}
              className={this.getClass(33)}><span> 33 </span></td>
            <td
              ref={this.selector[36]}
              className={this.getClass(36)}><span> 36 </span></td>
            <td
              ref={this.selector[37]}
              className={this.getClass('row1', 'sector')}>
              <span className="vt"> 2 to 1 </span>
            </td>
          </tr>
          <tr className="nums">
            <td className="hidden"/>
            <td ref={this.selector[2]} className={this.getClass(2)}><span>2</span></td>
            <td ref={this.selector[5]} className={this.getClass(5)}><span>5</span></td>
            <td ref={this.selector[8]} className={this.getClass(8)}><span>8</span></td>
            <td ref={this.selector[11]} className={this.getClass(11)}><span>11</span></td>
            <td ref={this.selector[14]} className={this.getClass(14)}><span>14</span></td>
            <td ref={this.selector[17]} className={this.getClass(17)}><span>17</span></td>
            <td ref={this.selector[20]} className={this.getClass(20)}><span>20</span></td>
            <td ref={this.selector[23]} className={this.getClass(23)}><span>23</span></td>
            <td ref={this.selector[26]} className={this.getClass(26)}><span>26</span></td>
            <td ref={this.selector[29]} className={this.getClass(29)}><span>29</span></td>
            <td ref={this.selector[32]} className={this.getClass(32)}><span>32</span></td>
            <td ref={this.selector[35]} className={this.getClass(35)}><span>35</span></td>
            <td ref={this.selector[38]} className={this.getClass('row2', 'sector')}><span
              className="vt">2 to 1</span></td>
          </tr>
          <tr
            className="nums">
            <td
              className="hidden"/>
            <td
              ref={this.selector[1]}
              className={this.getClass(1)}><span> 1 </span>
            </td>
            <td
              ref={this.selector[4]}
              className={this.getClass(4)}><span> 4 </span></
              td>
            <td
              ref={this.selector[7]}
              className={this.getClass(7)}><span> 7 </span></td>
            <td
              ref={this.selector[10]}
              className={this.getClass(10)}><span> 10 </span></td>
            <td
              ref={this.selector[13]}
              className={this.getClass(13)}><span> 13 </span></td>
            <td
              ref={this.selector[16]}
              className={this.getClass(16)}><span> 16 </span></td>
            <td
              ref={this.selector[19]}
              className={this.getClass(19)}><span> 19 </span></td>
            <td
              ref={this.selector[22]}
              className={this.getClass(22)}><span> 22 </span></td>
            <td
              ref={this.selector[25]}
              className={this.getClass(25)}><span> 25 </span></td>
            <td
              ref={this.selector[28]}
              className={this.getClass(28)}><span> 28 </span></td>
            <td
              ref={this.selector[31]}
              className={this.getClass(31)}><span> 31 </span></td>
            <td
              ref={this.selector[34]}
              className={this.getClass(34)}><span> 34 </span></td>
            <td
              ref={this.selector[39]}
              className={this.getClass('row3', 'sector')}><span className="vt">2 to 1</span></td>
          </tr>
          <tr>
            <td className="empty"/>
            <td ref={this.selector[40]}
                colSpan="4"
                className={this.getClass('first', 'sector')}>1st 12
            </td>
            <td ref={this.selector[41]}
                colSpan="4"
                className={this.getClass('second', 'sector')}>2nd 12
            </td>
            <td ref={this.selector[42]}
                colSpan="4"
                className={this.getClass('third', 'sector')}>3rd 12
            </td>
            <td className="empty"/>
          </tr>
          <tr>
            <td
              className="empty"/>
            <td
              ref={this.selector[43]}
              colSpan="2"
              className={this.getClass('half1', 'sector')}> 1 to 18
            </td>
            <td ref={this.selector[44]}
                colSpan="2"
                className={this.getClass('even', 'sector')}>EVEN
            </td>
            <td
              ref={this.selector[45]}
              colSpan="2"
              className={this.getClass('red', 'sector')}> RED
            </td>
            <td ref={this.selector[46]}
                colSpan="2"
                className={this.getClass('black', 'sector')}>BLACK
            </td>
            <td
              ref={this.selector[47]}
              colSpan="2"
              className={this.getClass('odd', 'sector')}> ODD
            </td>
            <td ref={this.selector[48]}
                colSpan="2"
                className={this.getClass('half2', 'sector')}>19 to 36
            </td>
            <td className="empty"/>
          </tr>
          </tbody>
        </table>
      </div>

    )
  }
}

function rInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
