import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Products from './pages/Products'
import ViewMyOrders from './pages/ViewMyOrders'
import DeliverLogin from './pages/DeliverLogin'
import DeliverDashboard from './pages/DeliverDashboard'
import MapView from './pages/MapView'
import CustomerTrackingVIew from './pages/CustomerTrackingVIew'
import RiderView from './pages/RiderView'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [deliverId, setDeliverId] = useState(null)

  const handleLoginSuccess = (role, id) => {
    setIsAuthenticated(true)
    setUserRole(role)
    if (role === 'DELIVER') {
      setDeliverId(id)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    setDeliverId(null)
    localStorage.removeItem('user')
  }

  // ProtectedRoute: redirects to login if not authenticated
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (allowedRole && userRole !== allowedRole) return <Navigate to="/login" replace />
    return children
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Auth Routes ── */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to={userRole === 'DELIVER' ? '/deliver-dashboard' : '/products'} replace />
              : <Login
                  onLoginSuccess={handleLoginSuccess}
                />
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated
              ? <Navigate to="/products" replace />
              : <Signup onSignupSuccess={handleLoginSuccess} />
          }
        />

        <Route
          path="/deliver-login"
          element={
            isAuthenticated
              ? <Navigate to="/deliver-dashboard" replace />
              : <DeliverLogin onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* ── Customer Routes ── */}
        <Route
          path="/products"
          element={
            <Products onLogout={handleLogout} />
          }
        />


          <Route
          path="/map-location"
          element={
            <MapView onLogout={handleLogout}   />
          }
        />
        <Route
          path="/my-orders"
          element={
            <ViewMyOrders onLogout={handleLogout} />
          }
        />
        <Route
          path="/track-order/:orderId"
          element={
            <CustomerTrackingVIew onLogout={handleLogout} />
          }
        />

        {/* ── Deliver Route ── */}
        <Route
          path="/deliver-dashboard"
          element={
            <DeliverDashboard onLogout={handleLogout} />
          }
        />
        <Route
          path="/rider-view/:orderId"
          element={
            <RiderView />
          }
        />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App