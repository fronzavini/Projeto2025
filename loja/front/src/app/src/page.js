"use client";
import React from "react";
import { Header } from "../components/blabla";
import data from "../data/headerData.json";

export default function Home() {
  return (
    <div>
      <Header data={data.slides} interval={3000} />
    </div>
  );
}
