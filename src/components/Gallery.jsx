import React, { useState } from 'react';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import './Gallery.css';

import img1 from '../assets/garage1.jpg';
import img2 from '../assets/garage2.jpg';
import img3 from '../assets/garage3.jpg';
import img4 from '../assets/garage4.jpg';
import img5 from '../assets/garage5.jpg';

const images = [img1, img2, img3, img4, img5];
const slides = images.map((src) => ({ src }));

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 600 }, items: 2 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 1 }
};

function Gallery() {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = (i) => {
    setIndex(i);
    setIsOpen(true);
  };

  return (
    <section id="gallery" className="py-5 bg-white">
      <div className="container">
        <h2 className="mb-4 fw-bold">Our Work</h2>
        <Carousel
          responsive={responsive}
          arrows
          infinite
          autoPlay
          autoPlaySpeed={3000} // scroll every 3 seconds (customize as needed)
          itemClass="px-3"
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Garage ${i}`}
              className="img-fluid rounded shadow gallery-img"
              onClick={() => openLightbox(i)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Carousel>


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

export default Gallery;
