import React from 'react';
import './zoom.css';
import zoomin from '../../assets/images/plusicon.png';
import zoomout from '../../assets/images/minicon.png';

export class Zoom extends React.Component {
	    render() {
	 return (
      <div className="zoom-container">
        <img className="zoombttn" src={zoomin} alt="zoom in"/>
        <img className="zoombttn" src={zoomout} alt="zoom out"/>
      	</div>
      )
  }
  };


