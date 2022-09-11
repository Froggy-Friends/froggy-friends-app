import { Provider } from 'react-redux';
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@mui/material';
import { DAppProvider } from '@usedapp/core';
import { store } from "./redux/store";
import { ErrorBoundary } from './components/ErrorBoundary';
import theme from './theme';
import config from './config';
import Admin from "./pages/Admin";
import Staking from "./pages/Staking";
import Market from "./pages/Market";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Board from "./pages/Board";
import Items from "./pages/Items";
import { useState } from 'react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const appTheme = theme(isDarkMode);
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={appTheme}>
          <DAppProvider config={config}>
            <BrowserRouter>
              <Header/>
              <Routes>
                <Route path="/staking" element={<Staking/>} />
                <Route path="/admin" element={<Admin/>} />
                <Route path="/market" element={<Market/>}/>
                <Route path="/leaderboard" element={<Board/>} />
                <Route path="/items" element={<Items/>} />
                <Route path="*" element={ <Navigate to="/staking" replace />} />
              </Routes>
              <Footer/>
            </BrowserRouter>
          </DAppProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  )
}