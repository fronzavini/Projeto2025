"use client";
import Header from "./components/header";

const slides = [
  {
    src: "/imgs/slider1.jpg", // desktop
    mobile: "/imgs/slider1-mobile.jpg",
  },
  {
    src: "/imgs/slider2.jpg",
    mobile: "/imgs/slider2-mobile.jpg",
  },
  {
    src: "/imgs/slider3.jpg",
    mobile: "/imgs/slider3-mobile.jpg",
  },
];

export default function Home() {
  return <Header slides={slides} interval={3000} />;
}
