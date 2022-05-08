import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Staking from "./pages/Staking";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Staking/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
      <Footer/>
    </Fragment>
  )
}