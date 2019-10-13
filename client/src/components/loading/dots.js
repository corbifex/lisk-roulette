import React from 'react';

export class Dots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dots: 1};
    setTimeout(() => {
      this.updateDots();
    }, 1000);
  }

  updateDots() {
    this.setState({dots: this.state.dots + 1});
    setTimeout(() => {
      this.updateDots();
    }, 1000);
  }

  render() {
    return (<i>{'.'.repeat(this.state.dots % 4)}</i>);
  }
}
