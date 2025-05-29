import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Homepage from './components/Homepage'
import Movies from './components/movies/Movies'
import Auth from './components/Auth/Auth'
import MovieDetails from './components/movies/MovieDetails'
import Booking from './components/booking/Booking'
import UserBookings from './components/booking/UserBookings'
import AdminDashboard from './components/Admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { authService } from './services/api'
import AdminAuth from './components/Auth/AdminAuth'

const App = () => {
  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      console.log('Initializing auth state:', { token, user });
      // Force a storage event to update the header
      const storageEvent = new StorageEvent('storage', {
        key: 'user',
        newValue: user,
        url: window.location.href
      });
      window.dispatchEvent(storageEvent);
    }
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/movies" element={<Movies />} />
          <Route 
            path="/movies/:id" 
            element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking/:id" 
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <UserBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin/login" element={<AdminAuth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App


