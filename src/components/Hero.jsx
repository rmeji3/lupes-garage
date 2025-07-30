import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <header className="hero-section text-white d-flex align-items-center">
      <div className="container text-start">

        <h1 className="hero-title">
          YOUR TRUSTED <span className="green-text">GARAGE DOOR</span> <span className="green-text"><br />EXPERTS </span>
          IN CHICAGO, IL
        </h1>
        <p className="hero-subtext">
          Serving homeowners and businesses across the Chicago area with top-quality garage door repair, installation, and maintenance.
        </p>
        <div className="hero-buttons d-flex flex-wrap gap-3 mt-4">
          <a href="#services" className="btn custom-estimate-btn btn-lg px-4">
            VIEW SERVICES
          </a>
          <a href="tel:17085950374" className="btn btn-outline-light btn-lg px-4 d-flex align-items-center gap-2">
            <i className="bi bi-telephone-fill"></i> CALL US NOW
            <br /><small>(708) 595-0374</small>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Hero;
