import { createContext, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { DAppProvider } from '@usedapp/core';
import { store } from "./redux/store";
import { ErrorBoundary } from './components/ErrorBoundary';
import getTheme from './theme';
import config from './config';
import Admin from "./pages/Admin";
import Staking from "./pages/Staking";
import Market from "./pages/Market";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Board from "./pages/Board";
import Items from "./pages/Items";
import ItemDetails from './pages/ItemDetails';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function App() {
  const [mode, setMode] = useState<PaletteMode>('dark');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => getTheme(mode === 'dark'), [mode]);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline/>
            <DAppProvider config={config}>
              <BrowserRouter>
                <Header/>
                <Routes>
                  <Route path="/staking" element={<Staking/>} />
                  <Route path="/admin" element={<Admin/>} />
                  <Route path="/market" element={<Market/>}/>
                  <Route path="/leaderboard" element={<Board/>} />
                  <Route path="/item" element={<ItemDetails/>} />
                  <Route path="*" element={ <Navigate to="/staking" replace />} />
                </Routes>
                <Footer/>
              </BrowserRouter>
            </DAppProvider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </Provider>
    </ErrorBoundary>
  )
}