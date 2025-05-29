import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/api';
import './UserBookings.css';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings();
      console.log('User bookings response:', response);
      if (response.data && Array.isArray(response.data.bookings)) {
        setBookings(response.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching user bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.deleteBooking(bookingId);
      // Refresh bookings after deletion
      fetchUserBookings();
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  if (loading) {
    return <div className="bookings-container">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="bookings-container error">{error}</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="bookings-container">
        <h2>My Bookings</h2>
        <p>You haven't made any bookings yet.</p>
        <button 
          className="browse-movies-button"
          onClick={() => navigate('/movies')}
        >
          Browse Movies
        </button>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <div className="booking-header">
              <h3>{booking.movieName.title}</h3>
              <button
                className="delete-button"
                onClick={() => handleDeleteBooking(booking._id)}
              >
                Cancel Booking
              </button>
            </div>
            <div className="booking-details">
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(booking.date).toLocaleTimeString()}</p>
              <p><strong>Seats:</strong> {booking.seatNumber}</p>
            </div>
            <div className="booking-poster">
              <img src={booking.movieName.posterUrl} alt={booking.movieName.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookings; 