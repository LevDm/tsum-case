import React, { useState, useRef } from "react";

import "../../styles/carousel.css";

import basename from "../../services/basename";

export function Carousel({ images = [] }) {
  const carouselListRef = useRef(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleScroll = () => {
    if (!carouselListRef.current) return;
    const slideWidth = carouselListRef.current.offsetWidth;
    const { gap } = window.getComputedStyle(carouselListRef.current);
    const gapInt = (images.length - 1) * parseInt(gap);

    const offset = carouselListRef.current.scrollLeft;

    const newIndex = Math.round(Math.max(offset - gapInt, 0) / slideWidth);

    if (newIndex != currentImageIndex) setCurrentImageIndex(newIndex);
  };

  const scrollToIndex = (index, behavior = "smooth") => {
    if (!carouselListRef.current) return;
    const slideWidth = carouselListRef.current.offsetWidth;
    const { gap } = window.getComputedStyle(carouselListRef.current);
    carouselListRef.current.scrollTo({
      left: (slideWidth + parseInt(gap)) * index,
      behavior: behavior,
    });
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % images.length;
    scrollToIndex(newIndex);
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    scrollToIndex(newIndex);
  };

  const scrollRef = useRef({ startX: 0, newIndex: 0 });

  const handleDragStart = ({ clientX }) => {
    scrollRef.current.startX = clientX;
  };

  const handleDragEnd = () => {
    scrollRef.current.startX = 0;
    if (scrollRef.current.newIndex != currentImageIndex) scrollToIndex(scrollRef.current.newIndex);
  };

  const handleDrag = ({ clientX }) => {
    if (clientX == 0) return;
    const targetOffset = 0.5 * carouselListRef?.current.offsetWidth ?? 0;
    let newIndex = currentImageIndex;
    const decr = clientX - scrollRef.current.startX;

    if (decr > targetOffset) {
      newIndex = (currentImageIndex + 1) % images.length;
    } else if (decr < -targetOffset) {
      newIndex = (currentImageIndex - 1 + images.length) % images.length;
    }

    scrollRef.current.newIndex = newIndex;
  };

  return (
    <div className="carousel">
      <ul
        id="list"
        className="carousel-list"
        ref={carouselListRef}
        onScroll={handleScroll}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {images.map((image, index) => (
          <li key={index}>
            <img src={basename + image} />
          </li>
        ))}
      </ul>

      <button className="button to-left" onClick={prevImage}>
        Prev
      </button>
      <button className="button to-right" onClick={nextImage}>
        Next
      </button>

      <div className="indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={index === currentImageIndex ? "active" : ""}
            onClick={() => scrollToIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
