import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import LandingPage from './pages.jsx/LandingPage'

function App() {
  return (
    <Router>
      <LandingPage />
    </Router>
  )
}

export default App
