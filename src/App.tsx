import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Staking from "./pages/Staking";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Staking/>} />
      
    </Routes>
  )
}