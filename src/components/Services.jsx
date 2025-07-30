import React from 'react';
import './Services.css';

function Services() {
  const services = [
    {
      title: "Garage Door Repairs",
      icon: "wrench",
      desc: "Fast repairs for noisy, stuck, or broken garage doors — we fix it right the first time."
    },
    {
      title: "New Door Installations",
      icon: "door-closed",
      desc: "We install high-quality garage doors for homes and businesses with perfect fit & finish."
    },
    {
      title: "Broken Cable Replacements",
      icon: "arrow-repeat",
      desc: "Snapped cables are dangerous — we replace them safely and quickly."
    },
    {
      title: "Motor Repairs & Upgrades",
      icon: "cpu",
      desc: "We repair or replace garage door motors for smooth, quiet operation."
    },
    {
      title: "Spring Replacements",
      icon: "bounding-box",
      desc: "Torsion or extension springs — we handle all types safely and professionally."
    },
    {
      title: "Maintenance & Tune-Ups",
      icon: "gear",
      desc: "Keep your garage door running strong with regular inspections and servicing."
    }
  ];

  return (
    <section id="services" className="py-5 bg-light">
      <div className="container">
        <h2 className="mb-4 fw-bold">Our Services</h2>
        <p className="mb-5 fs-5 text-muted">
          We handle everything from small fixes to full installations — always with top-quality parts and honest pricing.
        </p>

        <ul className="list-unstyled service-list">
          {services.map((item, index) => (
            <li key={index} className="mb-4 d-flex align-items-start gap-3">
              <i className={`bi bi-${item.icon} fs-2 text-success`}></i>
              <div>
                <h5 className="fw-bold mb-1">{item.title}</h5>
                <p className="mb-0 text-muted">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Services;
