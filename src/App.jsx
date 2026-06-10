import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import '@mantine/core/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';

// import PageNotFound from './pages/404';


const theme = createTheme({
  fontFamily: 'Montserrat, sans-serif',
  components: {
    Textarea: {
      styles: () => ({
        input: {
          fontSize: '16px',
        },
      })
    },
    TextInput: {
      styles: () => ({
        input: {
          fontSize: '16px',
        },
      })
    },
    PasswordInput: {
      styles: () => ({
        input: {
          fontSize: '16px',
        },
      })
    },
    NumberInput: {
      styles: () => ({
        input: {
          fontSize: '16px',
        },
      })
    },
  }
})

import Login from './pages/auth/Login';

import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/panel/Dashboard';
import { Inventory } from './pages/panel/Inventory';
function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>

          {/* <Route path='/' element={<Login/>}/> */}
          <Route element={<Navbar />}>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/inventory' element={<Inventory/>}/>
          </Route>

        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App