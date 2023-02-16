import { createContext, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { CssBaseline, PaletteMode, ThemeProvider, useMediaQuery } from '@mui/material';
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
import ItemDetails from './pages/ItemDetails';
import FrogDetails from './pages/FrogDetails';
import BoardMobile from './pages/BoardMobile';
import Studio from './pages/Studio';
import Spaces from './pages/Spaces';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const ProtectedRoute = ({ admin, children}: { admin: boolean, children: any}) => {
  if (!admin) {
    return <Navigate to="/staking" replace/>
  }
  return children;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [mode, setMode] = useState<PaletteMode>('dark');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  const theme = useMemo(() => getTheme(mode === 'dark'), [mode])
  const isSm = useMediaQuery(theme.breakpoints.down("md"));

  const onAdminChange = (admin: boolean) => {
    setIsAdmin(admin);
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline/>
            <DAppProvider config={config}>
              <BrowserRouter>
                <Header isAdmin={isAdmin} onAdminChange={onAdminChange}/>
                <Routes>
                  <Route path="/portfolio" element={<Staking/>} />
                  <Route path="/market" element={<Market/>}/>
                  <Route path="/studio" element={<Studio/>}/>
                  <Route path="/spaces" element={<Spaces/>}/>
                  <Route path="/board" element={isSm ? <BoardMobile/> : <Board/>} />
                  <Route path="/item/:id" element={<ItemDetails/>} />
                  <Route path='/frog/:id' element={<FrogDetails/>}/>
                  <Route path="/admin" element={
                    <ProtectedRoute admin={isAdmin}>
                      <Admin/>
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={ <Navigate to="/portfolio" replace />} />
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