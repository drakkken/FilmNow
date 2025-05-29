import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Homepage from './components/Homepage.jsx'
import Movies from './components/movies/Movies.jsx'
import Admin from './components/Admin/Admin.jsx'
import Auth from './components/Auth/Auth.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <section>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/movies' element={<Movies/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/auth' element={<Auth/>}/>
      </Routes>
    </section>
    </>
  )
}

export default App


