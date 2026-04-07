import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { BookingProvider } from './contexts/BookingContext'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/*" element={<AdminPage />} />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
