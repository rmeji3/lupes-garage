import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import beforeImg from '../assets/before.jpg';
import afterImg from '../assets/after.jpg';

import './BeforeAfter.css';

const slides = [
    { src: beforeImg },
    { src: afterImg }
  ];

  
function BeforeAfter() {
    const [isOpen, setIsOpen] = useState(false);
    const [index, setIndex] = useState(0);
  
    const openLightbox = (i) => {
      setIndex(i);
      setIsOpen(true);
    };
  
    return (
      <section id="before-after" className="py-5 bg-white">
        <div className="container">
          <h2 className="mb-4 fw-bold">Before & After</h2>
          <div className="row align-items-center">
            <div className="col-md-6 text-center mb-3">
              <h5 className="fw-bold">Before</h5>
              <img
                src={beforeImg}
                alt="Before"
                className="img-fluid rounded shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => openLightbox(0)}
              />
            </div>
            <div className="col-md-6 text-center mb-3">
              <h5 className="fw-bold">After</h5>
              <img
                src={afterImg}
                alt="After"
                className="img-fluid rounded shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => openLightbox(1)}
              />
            </div>
          </div>
  
          <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={slides}
          index={index}
          on={{ view: ({ index }) => setIndex(index) }}
          render={{
            slide: ({ slide, rect }) => (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => setIsOpen(false)} // close when background is clicked
              >
                <img
                  src={slide.src}
                  alt=""
                  style={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                    borderRadius: '5px'
                  }}
                  onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image
                />
              </div>
            )
          }}
        />
        </div>
      </section>
    );
  }
  
  export default BeforeAfter;
  