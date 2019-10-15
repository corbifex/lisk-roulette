import React from 'react';
import './field.css';

export class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,'row1','row2','row3',
        'first', 'second', 'third', 'half1', 'even', 'black', 'red', 'odd', 'half2'
      ],
      selectors: {
        green: [0],
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
      }
    };
    this.selector = new Array(48);
    for(let i = 0; i < 48; i++) {
      this.selector[i] = React.createRef();
    }
  }

  componentDidMount = () => {
    const rect = this.selector[0].current.getBoundingClientRect();
    console.log(rect);
  };

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

    if (this.state.hover === field) {
      classname += "hover ";
    }

    if (this.state.hover && typeof this.state.hover !== "number") {
      if (this.state.selectors[this.state.hover].indexOf(field) > -1) {
        classname += "hover ";
      }
    }

    return classname;
  }

  render() {
    return (
      <div className="Field-container">
        <table onMouseOut={this.mouseOver.bind(this, null)}>
          <tbody>
          <tr className="nums">
            <td ref={this.selector[0]} onClick={this.props.clickField.bind(this, 0)} className={this.getClass(0)} rowSpan="3"
                onMouseOver={this.mouseOver.bind(this, 0)}><span>0</span></td>
            <td ref={this.selector[3]} onClick={this.props.clickField.bind(this, 3)} className={this.getClass(3)}
                onMouseOver={this.mouseOver.bind(this, 3)}><span>3</span></td>
            <td ref={this.selector[6]} onClick={this.props.clickField.bind(this, 6)} className={this.getClass(6)}
                onMouseOver={this.mouseOver.bind(this, 6)}><span>6</span></td>
            <td ref={this.selector[9]} onClick={this.props.clickField.bind(this, 9)} className={this.getClass(9)}
                onMouseOver={this.mouseOver.bind(this, 9)}><span>9</span></td>
            <td ref={this.selector[12]} onClick={this.props.clickField.bind(this, 12)} className={this.getClass(12)}
                onMouseOver={this.mouseOver.bind(this, 12)}><span>12</span></td>
            <td ref={this.selector[15]} onClick={this.props.clickField.bind(this, 15)} className={this.getClass(15)}
                onMouseOver={this.mouseOver.bind(this, 15)}><span>15</span></td>
            <td ref={this.selector[18]} onClick={this.props.clickField.bind(this, 18)} className={this.getClass(18)}
                onMouseOver={this.mouseOver.bind(this, 18)}><span>18</span></td>
            <td ref={this.selector[21]} onClick={this.props.clickField.bind(this, 21)} className={this.getClass(21)}
                onMouseOver={this.mouseOver.bind(this, 21)}><span>21</span></td>
            <td ref={this.selector[24]} onClick={this.props.clickField.bind(this, 24)} className={this.getClass(24)}
                onMouseOver={this.mouseOver.bind(this, 24)}><span>24</span></td>
            <td ref={this.selector[27]} onClick={this.props.clickField.bind(this, 27)} className={this.getClass(27)}
                onMouseOver={this.mouseOver.bind(this, 27)}><span>27</span></td>
            <td ref={this.selector[0]} onClick={this.props.clickField.bind(this, 30)} className={this.getClass(30)}
                onMouseOver={this.mouseOver.bind(this, 30)}><span>30</span></td>
            <td onClick={this.props.clickField.bind(this, 33)} className={this.getClass(33)}
                onMouseOver={this.mouseOver.bind(this, 33)}><span>33</span></td>
            <td onClick={this.props.clickField.bind(this, 36)} className={this.getClass(36)}
                onMouseOver={this.mouseOver.bind(this, 36)}><span>36</span></td>
            <td onClick={this.props.clickField.bind(this, 'row1')} className={this.getClass('row1', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'row1')}><span className="vt">2 to 1</span></td>
          </tr>
          <tr className="nums">
            <td className="hidden"/>
            <td onClick={this.props.clickField.bind(this, 2)} className={this.getClass(2)}
                onMouseOver={this.mouseOver.bind(this, 2)}><span>2</span></td>
            <td onClick={this.props.clickField.bind(this, 5)} className={this.getClass(5)}
                onMouseOver={this.mouseOver.bind(this, 5)}><span>5</span></td>
            <td onClick={this.props.clickField.bind(this, 8)} className={this.getClass(8)}
                onMouseOver={this.mouseOver.bind(this, 8)}><span>8</span></td>
            <td onClick={this.props.clickField.bind(this, 11)} className={this.getClass(11)}
                onMouseOver={this.mouseOver.bind(this, 11)}><span>11</span></td>
            <td onClick={this.props.clickField.bind(this, 14)} className={this.getClass(14)}
                onMouseOver={this.mouseOver.bind(this, 14)}><span>14</span></td>
            <td onClick={this.props.clickField.bind(this, 17)} className={this.getClass(17)}
                onMouseOver={this.mouseOver.bind(this, 17)}><span>17</span></td>
            <td onClick={this.props.clickField.bind(this, 20)} className={this.getClass(20)}
                onMouseOver={this.mouseOver.bind(this, 20)}><span>20</span></td>
            <td onClick={this.props.clickField.bind(this, 23)} className={this.getClass(23)}
                onMouseOver={this.mouseOver.bind(this, 23)}><span>23</span></td>
            <td onClick={this.props.clickField.bind(this, 26)} className={this.getClass(26)}
                onMouseOver={this.mouseOver.bind(this, 26)}><span>26</span></td>
            <td onClick={this.props.clickField.bind(this, 29)} className={this.getClass(29)}
                onMouseOver={this.mouseOver.bind(this, 29)}><span>29</span></td>
            <td onClick={this.props.clickField.bind(this, 32)} className={this.getClass(32)}
                onMouseOver={this.mouseOver.bind(this, 32)}><span>32</span></td>
            <td onClick={this.props.clickField.bind(this, 35)} className={this.getClass(35)}
                onMouseOver={this.mouseOver.bind(this, 35)}><span>35</span></td>
            <td onClick={this.props.clickField.bind(this, 'row2')} className={this.getClass('row2', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'row2')}><span
              className="vt">2 to 1</span></td>
          </tr>
          <tr className="nums">
            <td className="hidden"/>
            <td onClick={this.props.clickField.bind(this, 1)} className={this.getClass(1)}
                onMouseOver={this.mouseOver.bind(this, 1)}><span>1</span></td>
            <td onClick={this.props.clickField.bind(this, 4)} className={this.getClass(4)}
                onMouseOver={this.mouseOver.bind(this, 4)}><span>4</span></td>
            <td onClick={this.props.clickField.bind(this, 7)} className={this.getClass(7)}
                onMouseOver={this.mouseOver.bind(this, 7)}><span>7</span></td>
            <td onClick={this.props.clickField.bind(this, 10)} className={this.getClass(10)}
                onMouseOver={this.mouseOver.bind(this, 10)}><span>10</span></td>
            <td onClick={this.props.clickField.bind(this, 13)} className={this.getClass(13)}
                onMouseOver={this.mouseOver.bind(this, 13)}><span>13</span></td>
            <td onClick={this.props.clickField.bind(this, 16)} className={this.getClass(16)}
                onMouseOver={this.mouseOver.bind(this, 16)}><span>16</span></td>
            <td onClick={this.props.clickField.bind(this, 19)} className={this.getClass(19)}
                onMouseOver={this.mouseOver.bind(this, 19)}><span>19</span></td>
            <td onClick={this.props.clickField.bind(this, 22)} className={this.getClass(22)}
                onMouseOver={this.mouseOver.bind(this, 22)}><span>22</span></td>
            <td onClick={this.props.clickField.bind(this, 25)} className={this.getClass(25)}
                onMouseOver={this.mouseOver.bind(this, 25)}><span>25</span></td>
            <td onClick={this.props.clickField.bind(this, 28)} className={this.getClass(28)}
                onMouseOver={this.mouseOver.bind(this, 28)}><span>28</span></td>
            <td onClick={this.props.clickField.bind(this, 31)} className={this.getClass(31)}
                onMouseOver={this.mouseOver.bind(this, 31)}><span>31</span></td>
            <td onClick={this.props.clickField.bind(this, 34)} className={this.getClass(34)}
                onMouseOver={this.mouseOver.bind(this, 34)}><span>34</span></td>
            <td onClick={this.props.clickField.bind(this, 'row3')} className={this.getClass('row3', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'row3')}><span
              className="vt">2 to 1</span></td>
          </tr>
          <tr>
            <td className="empty"/>
            <td onClick={this.props.clickField.bind(this, 'first')} colSpan="4"
                className={this.getClass('first', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'first')}>1st 12
            </td>
            <td onClick={this.props.clickField.bind(this, 'second')} colSpan="4"
                className={this.getClass('second', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'second')}>2nd 12
            </td>
            <td onClick={this.props.clickField.bind(this, 'third')} colSpan="4"
                className={this.getClass('third', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'third')}>3rd 12
            </td>
            <td className="empty"/>
          </tr>
          <tr>
            <td className="empty"/>
            <td onClick={this.props.clickField.bind(this, 'half1')} colSpan="2"
                className={this.getClass('half1', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'half1')}>1 to 18
            </td>
            <td onClick={this.props.clickField.bind(this, 'even')} colSpan="2"
                className={this.getClass('even', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'even')}>EVEN
            </td>
            <td onClick={this.props.clickField.bind(this, 'red')} colSpan="2" className={this.getClass('red', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'red')}>RED
            </td>
            <td onClick={this.props.clickField.bind(this, 'black')} colSpan="2"
                className={this.getClass('black', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'black')}>BLACK
            </td>
            <td onClick={this.props.clickField.bind(this, 'odd')} colSpan="2" className={this.getClass('odd', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'odd')}>ODD
            </td>
            <td onClick={this.props.clickField.bind(this, 'half2')} colSpan="2"
                className={this.getClass('half2', 'sector')}
                onMouseOver={this.mouseOver.bind(this, 'half2')}>19 to 36
            </td>
            <td className="empty"/>
          </tr>
          </tbody>
        </table>
        {/*<div className="controlls">*/}
        {/*  <div className="btn btn-zero" data-num="0"/>*/}
        {/*  <div className="col1">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="0,3"/>*/}
        {/*      <div className="btn m rm cm" data-num="3"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="0,2,3"/>*/}
        {/*      <div className="btn v rm cv" data-num="0,2"/>*/}
        {/*      <div className="btn h rh cm" data-num="2,3"/>*/}
        {/*      <div className="btn m rm cm" data-num="2"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="0,1,2"/>*/}
        {/*      <div className="btn v rm cv" data-num="0,1"/>*/}
        {/*      <div className="btn c rb cv" data-num="0,1,2,3"/>*/}
        {/*      <div className="btn h rh cm" data-num="1,2"/>*/}
        {/*      <div className="btn m rm cm" data-num="1"/>*/}
        {/*      <div className="btn h rb cm" data-num="1,2,3"/>*/}
        {/*    </div>*/}
        {/*    <div className="row4">*/}
        {/*      <div className="btn ms4 rm cm" data-type="sector" data-sector="4"/>*/}
        {/*    </div>*/}
        {/*    <div className="row5">*/}
        {/*      <div className="btn ms2 rm cm" data-type="sector" data-sector="7"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col2">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="3,6"/>*/}
        {/*      <div className="btn m rm cm" data-num="6"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="2,3,5,6"/>*/}
        {/*      <div className="btn v rm cv" data-num="2,5"/>*/}
        {/*      <div className="btn h rh cm" data-num="5,6"/>*/}
        {/*      <div className="btn m rm cm" data-num="5"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="1,2,4,5"/>*/}
        {/*      <div className="btn v rm cv" data-num="1,4"/>*/}
        {/*      <div className="btn c rb cv" data-num="1,2,3,4,5,6"/>*/}
        {/*      <div className="btn h rh cm" data-num="4,5"/>*/}
        {/*      <div className="btn m rm cm" data-num="4"/>*/}
        {/*      <div className="btn h rb cm" data-num="4,5,6"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col3">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="6,9"/>*/}
        {/*      <div className="btn m rm cm" data-num="9"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="5,6,8,9"/>*/}
        {/*      <div className="btn v rm cv" data-num="5,8"/>*/}
        {/*      <div className="btn h rh cm" data-num="8,9"/>*/}
        {/*      <div className="btn m rm cm" data-num="8"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="4,5,7,8"/>*/}
        {/*      <div className="btn v rm cv" data-num="4,7"/>*/}
        {/*      <div className="btn c rb cv" data-num="4,5,6,7,8,9"/>*/}
        {/*      <div className="btn h rh cm" data-num="7,8"/>*/}
        {/*      <div className="btn m rm cm" data-num="7"/>*/}
        {/*      <div className="btn h rb cm" data-num="7,8,9"/>*/}
        {/*    </div>*/}
        {/*    <div className="row5">*/}
        {/*      <div className="btn ms2 rm cm" data-type="sector" data-sector="8"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col4">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="9,12"/>*/}
        {/*      <div className="btn m rm cm" data-num="12"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="8,9,11,12"/>*/}
        {/*      <div className="btn v rm cv" data-num="8,11"/>*/}
        {/*      <div className="btn h rh cm" data-num="11,12"/>*/}
        {/*      <div className="btn m rm cm" data-num="11"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="7,8,10,11"/>*/}
        {/*      <div className="btn v rm cv" data-num="7,10"/>*/}
        {/*      <div className="btn c rb cv" data-num="7,8,9,10,11,12"/>*/}
        {/*      <div className="btn h rh cm" data-num="10,11"/>*/}
        {/*      <div className="btn m rm cm" data-num="10"/>*/}
        {/*      <div className="btn h rb cm" data-num="10,11,12"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col5">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="12,15"/>*/}
        {/*      <div className="btn m rm cm" data-num="15"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="11,12,14,15"/>*/}
        {/*      <div className="btn v rm cv" data-num="11,14"/>*/}
        {/*      <div className="btn h rh cm" data-num="14,15"/>*/}
        {/*      <div className="btn m rm cm" data-num="14"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="10,11,13,14"/>*/}
        {/*      <div className="btn v rm cv" data-num="10,13"/>*/}
        {/*      <div className="btn c rb cv" data-num="10,11,12,13,14,15"/>*/}
        {/*      <div className="btn h rh cm" data-num="13,14"/>*/}
        {/*      <div className="btn m rm cm" data-num="13"/>*/}
        {/*      <div className="btn h rb cm" data-num="13,14,15"/>*/}
        {/*    </div>*/}
        {/*    <div className="row4">*/}
        {/*      <div className="btn ms4 rm cm" data-type="sector" data-sector="5"/>*/}
        {/*    </div>*/}
        {/*    <div className="row5">*/}
        {/*      <div className="btn ms2 rm cm" data-type="sector" data-sector="9"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col6">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="15,18"/>*/}
        {/*      <div className="btn m rm cm" data-num="18"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="14,15,17,18"/>*/}
        {/*      <div className="btn v rm cv" data-num="14,17"/>*/}
        {/*      <div className="btn h rh cm" data-num="17,18"/>*/}
        {/*      <div className="btn m rm cm" data-num="17"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="13,14,16,17"/>*/}
        {/*      <div className="btn v rm cv" data-num="13,16"/>*/}
        {/*      <div className="btn c rb cv" data-num="13,14,15,16,17,18"/>*/}
        {/*      <div className="btn h rh cm" data-num="16,17"/>*/}
        {/*      <div className="btn m rm cm" data-num="16"/>*/}
        {/*      <div className="btn h rb cm" data-num="16,17,18"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col7">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="18,21"/>*/}
        {/*      <div className="btn m rm cm" data-num="21"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="17,18,20,21"/>*/}
        {/*      <div className="btn v rm cv" data-num="17,20"/>*/}
        {/*      <div className="btn h rh cm" data-num="20,21"/>*/}
        {/*      <div className="btn m rm cm" data-num="20"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="16,17,19,20"/>*/}
        {/*      <div className="btn v rm cv" data-num="16,19"/>*/}
        {/*      <div className="btn c rb cv" data-num="16,17,18,19,20,21"/>*/}
        {/*      <div className="btn h rh cm" data-num="19,20"/>*/}
        {/*      <div className="btn m rm cm" data-num="19"/>*/}
        {/*      <div className="btn h rb cm" data-num="19,20,21"/>*/}
        {/*    </div>*/}
        {/*    <div className="row5">*/}
        {/*      <div className="btn ms2 rm cm" data-type="sector" data-sector="10"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col8">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="21,24"/>*/}
        {/*      <div className="btn m rm cm" data-num="24"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="20,21,23,24"/>*/}
        {/*      <div className="btn v rm cv" data-num="20,23"/>*/}
        {/*      <div className="btn h rh cm" data-num="23,24"/>*/}
        {/*      <div className="btn m rm cm" data-num="23"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="19,20,22,23"/>*/}
        {/*      <div className="btn v rm cv" data-num="19,22"/>*/}
        {/*      <div className="btn c rb cv" data-num="19,20,21,22,23,24"/>*/}
        {/*      <div className="btn h rh cm" data-num="22,23"/>*/}
        {/*      <div className="btn m rm cm" data-num="22"/>*/}
        {/*      <div className="btn h rb cm" data-num="22,23,24"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col9">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="24,27"/>*/}
        {/*      <div className="btn m rm cm" data-num="27"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="23,24,26,27"/>*/}
        {/*      <div className="btn v rm cv" data-num="23,26"/>*/}
        {/*      <div className="btn h rh cm" data-num="26,27"/>*/}
        {/*      <div className="btn m rm cm" data-num="26"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="22,23,25,26"/>*/}
        {/*      <div className="btn v rm cv" data-num="22,25"/>*/}
        {/*      <div className="btn c rb cv" data-num="22,23,24,25,26,27"/>*/}
        {/*      <div className="btn h rh cm" data-num="25,26"/>*/}
        {/*      <div className="btn m rm cm" data-num="25"/>*/}
        {/*      <div className="btn h rb cm" data-num="25,26,27"/>*/}
        {/*    </div>*/}
        {/*    <div className="row4">*/}
        {/*      <div className="btn ms4 rm cm" data-type="sector" data-sector="6"/>*/}
        {/*    </div>*/}
        {/*    <div className="row5">*/}
        {/*      <div className="btn ms2 rm cm" data-type="sector" data-sector="11"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col10">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="27,30"/>*/}
        {/*      <div className="btn m rm cm" data-num="30"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="26,27,29,30"/>*/}
        {/*      <div className="btn v rm cv" data-num="26,29"/>*/}
        {/*      <div className="btn h rh cm" data-num="29,30"/>*/}
        {/*      <div className="btn m rm cm" data-num="29"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="25,26,28,29"/>*/}
        {/*      <div className="btn v rm cv" data-num="25,28"/>*/}
        {/*      <div className="btn c rb cv" data-num="25,26,27,28,29,30"/>*/}
        {/*      <div className="btn h rh cm" data-num="28,29"/>*/}
        {/*      <div className="btn m rm cm" data-num="28"/>*/}
        {/*      <div className="btn h rb cm" data-num="28,29,30"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col11">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="30,33"/>*/}
        {/*      <div className="btn m rm cm" data-num="33"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="29,30,32,33"/>*/}
        {/*      <div className="btn v rm cv" data-num="29,32"/>*/}
        {/*      <div className="btn h rh cm" data-num="32,33"/>*/}
        {/*      <div className="btn m rm cm" data-num="32"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="28,29,31,32"/>*/}
        {/*      <div className="btn v rm cv" data-num="28,31"/>*/}
        {/*      <div className="btn c rb cv" data-num="28,29,30,31,32,33"/>*/}
        {/*      <div className="btn h rh cm" data-num="31,32"/>*/}
        {/*      <div className="btn m rm cm" data-num="31"/>*/}
        {/*      <div className="btn h rb cm" data-num="31,32,33"/>*/}
        {/*    </div>*/}
        {/*    <div className="row5">*/}
        {/*      <div className="btn ms2 rm cm" data-type="sector" data-sector="12"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col12">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn v rm cv" data-num="33,36"/>*/}
        {/*      <div className="btn m rm cm" data-num="36"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn c rh cv" data-num="32,33,35,36"/>*/}
        {/*      <div className="btn v rm cv" data-num="32,35"/>*/}
        {/*      <div className="btn h rh cm" data-num="35,36"/>*/}
        {/*      <div className="btn m rm cm" data-num="35"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn c rh cv" data-num="31,32,34,35"/>*/}
        {/*      <div className="btn v rm cv" data-num="31,34"/>*/}
        {/*      <div className="btn c rb cv" data-num="31,32,33,34,35,36"/>*/}
        {/*      <div className="btn h rh cm" data-num="34,35"/>*/}
        {/*      <div className="btn m rm cm" data-num="34"/>*/}
        {/*      <div className="btn h rb cm" data-num="34,35,36"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="col13">*/}
        {/*    <div className="row1">*/}
        {/*      <div className="btn m rm cm" data-type="sector" data-sector="1"/>*/}
        {/*    </div>*/}
        {/*    <div className="row2">*/}
        {/*      <div className="btn m rm cm" data-type="sector" data-sector="2"/>*/}
        {/*    </div>*/}
        {/*    <div className="row3">*/}
        {/*      <div className="btn m rm cm" data-type="sector" data-sector="3"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    );
  }
}
