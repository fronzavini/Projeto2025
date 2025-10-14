"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/header.module.css";

export default function Header({ slides = [], interval = 3000 }) {
  const [index, setIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToSlide = (i) => setIndex(i);

  const getSlideSrc = (slide) => {
    if (windowWidth <= 768 && slide.mobile) return slide.mobile;
    return slide.src; // desktop padrão
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides, interval]);

  return (
    <header className={styles.header}>
      <div className={styles.carousel}>
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`${styles.slide} ${i === index ? styles.active : ""}`}
            style={{ backgroundImage: `url(${getSlideSrc(slide)})` }}
          >
            <div className={styles.overlay}></div>
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === index ? styles.activeDot : ""}`}
            onClick={() => goToSlide(i)}
          ></span>
        ))}
      </div>
    </header>
  );
}
