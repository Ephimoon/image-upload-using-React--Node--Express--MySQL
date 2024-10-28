import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home'
import View from './pages/View';

const App = () => {
  return (
    <BrowserRouter>
      <nav>
          <Link to="/">Home</Link>
          <Link to="/view">View</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/view' element={<View />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
