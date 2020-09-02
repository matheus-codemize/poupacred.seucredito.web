import React, { useState } from 'react';

import './styles.css';
function Sidebar() {
  const [open, setOpen] = useState(false);
  function sidebarToggle() {
    setOpen(!open);
    if (!open) {
      document.getElementById('mySidebar').classList.add('sidebar-open');
      document.getElementById('main').classList.add('main-open');
    } else {
      document.getElementById('mySidebar').classList.remove('sidebar-open');
      document.getElementById('main').classList.remove('main-open');
    }
    console.log(open);
  }
  function w3Open() {
    document.getElementById('mySidebar').classList.add('sidebar-open');
    document.getElementById('main').classList.add('main-open');
    // document.getElementById('main').style.marginLeft = '25%';
    // document.getElementById('mySidebar').style.width = '25%';
    // document.getElementById('mySidebar').style.display = 'block';
    // document.getElementById('openNav').style.display = 'none';
  }
  function w3Close() {
    document.getElementById('mySidebar').classList.remove('sidebar-open');
    document.getElementById('main').classList.remove('main-open');

    // document.getElementById('main').style.marginLeft = '0%';
    // document.getElementById('mySidebar').style.display = 'none';
    // document.getElementById('openNav').style.display = 'inline-block';
  }
  return (
    <div className="primary-background">
      <div
        className="w3-sidebar w3-bar-block w3-card w3-animate-left"
        id="mySidebar"
      >
        <button
          className="w3-bar-item w3-button w3-large"
          onClick={sidebarToggle}
        >
          Close &times;
        </button>
        <a href="/" className="w3-bar-item w3-button">
          Link 1
        </a>
        <a href="/" className="w3-bar-item w3-button">
          Link 2
        </a>
        <a href="/" className="w3-bar-item w3-button">
          Link 3
        </a>
      </div>
      <div id="main">
        <div className="w3-teal">
          <button
            id="openNav"
            className="w3-button w3-teal w3-xlarge"
            onClick={sidebarToggle}
          >
            &#9776;
          </button>
          <div className="w3-container">
            <h1>My Page</h1>
          </div>
        </div>

        {/* <img src="img_car.jpg" alt="Car" style="width:100%" /> */}
      </div>
    </div>
  );
}

export default Sidebar;
