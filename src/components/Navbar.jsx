import React, { useState, useEffect, useRef } from 'react';
import heroLogo from '../assets/heroLogo.png';
import './Navbar.css';

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm custom-navbar">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img
            src={heroLogo}
            alt="Lupe's Garage Doors"
            height="50"
          />
        </a>

        {/* Hamburger for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Desktop Nav Links */}
        <div className="collapse navbar-collapse d-none d-lg-flex" id="navMenu">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#gallery">Gallery</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#services">Services</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact</a>
            </li>
            <li className="nav-item">
              <a className="btn btn-outline-success ms-3 custom-estimate-btn" href="#contact">
                Free Estimate
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile Sidebar */}
        <div
          ref={sidebarRef}
          className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}
        >
          <a className="nav-link" href="#gallery">Gallery</a>
          <a className="nav-link" href="#services">Services</a>
          <a className="nav-link" href="#contact">Contact</a>
          <a className="btn btn-outline-success custom-estimate-btn" href="#contact">
            Free Estimate
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
