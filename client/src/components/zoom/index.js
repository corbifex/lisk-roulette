import React from 'react';
import zoomin from '../../assets/images/plusicon.png';
import zoomout from '../../assets/images/minicon.png';
import './zoom.css';

export class Zoom extends React.Component {
  render() {
    return (
      <div className="zoom-container">
        <img className="zoombttn" src={zoomin} alt="zoom in" onClick={this.props.zoom.bind(this, true)}/>
        <img className="zoombttn" src={zoomout} alt="zoom out" onClick={this.props.zoom.bind(this, false)}/>
      </div>)
  }
}
