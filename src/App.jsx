import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Added Navigate and Outlet
import './App.css';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Montserrat, sans-serif',
  components: {
    Textarea: { styles: () => ({ input: { fontSize: '16px' } }) },
    TextInput: { styles: () => ({ input: { fontSize: '16px' } }) },
    PasswordInput: { styles: () => ({ input: { fontSize: '16px' } }) },
    NumberInput: { styles: () => ({ input: { fontSize: '16px' } }) },
  }
});

import Login from './pages/auth/Login';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/panel/Dashboard';
import { Inventory } from './pages/panel/Inventory';
import { SearchResult } from './pages/panel/SearchResult';
import { LogPage } from './pages/panel/Log';
import { Staff } from './pages/panel/Staff';

import {AdminRoute} from './components/AdminRoute';
import {ProtectedRoute} from './components/ProtectedRoute'

function GuestRoute() {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          
          <Route element={<GuestRoute />}>
            <Route path='/' element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Navbar />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/inventory' element={<Inventory />} />
              <Route path='/search-results' element={<SearchResult />} /> 

              <Route element={<AdminRoute />}>
                <Route path='/logs' element={<LogPage />} />
                <Route path='/staff' element={<Staff />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App;