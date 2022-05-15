import { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Admin from "./pages/Admin";
import Staking from "./pages/Staking";
import Market from "./pages/Market";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function App() {
  return (
    <Fragment>
      <Header/>
      <Routes>
        <Route path="/staking" element={<Staking/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/market" element={<Market/>}/>
        <Route path="*" element={ <Navigate to="/staking" replace />} />
      </Routes>
      <Footer/>
    </Fragment>
  )
}