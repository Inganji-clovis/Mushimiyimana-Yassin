import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import SparePartsForm from './components/SparePartsForm'
import SparePartsTable from './components/SparePartsTable'
import StockManagement from './components/StockManagement'
import Reports from './components/Reports'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const { isAuthenticated, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [spareParts, setSpareParts] = useState([])
  const [count, setCount] = useState(0)

  const fetchSpareParts = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/spareparts')
      const data = await response.json()
      setSpareParts(data)
    } catch (error) {
      console.error('Error fetching spare parts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <nav className="navbar">
            <div className="nav-brand">
              <h1>Inventory Management</h1>
            </div>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/spare-parts" className="nav-link">Spare Parts</Link>
              <Link to="/stock" className="nav-link">Stock</Link>
              <Link to="/reports" className="nav-link">Reports</Link>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          </nav>
        )}

        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <div className="home-page">
                  <h2>Welcome to Inventory Management System</h2>
                  <p>Manage your spare parts, stock, and generate reports efficiently.</p>
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/spare-parts" element={
              <PrivateRoute>
                <div className="spare-parts-page">
                  <h2>Spare Parts Management</h2>
                  <div className="spare-parts-container">
                    <SparePartsForm />
                    <SparePartsTable />
                  </div>
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/stock" element={
              <PrivateRoute>
                <div className="stock-page">
                  <h2>Stock Management</h2>
                  <StockManagement />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/reports" element={
              <PrivateRoute>
                <div className="reports-page">
                  <h2>Reports</h2>
                  <Reports />
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
