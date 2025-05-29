import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService, bookingService } from '../../services/api';
import './Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Generate seat numbers (A1-A10, B1-B10, etc.)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;
  const seats = rows.flatMap(row => 
    Array.from({ length: seatsPerRow }, (_, i) => `${row}${i + 1}`)
  );

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await movieService.getMovieById(id);
      console.log('Movie details response:', response);
      if (!response || !response.movie) {
        throw new Error('Invalid movie data received');
      }
      setMovie(response.movie);
    } catch (err) {
      console.error('Error fetching movie:', err);
      setError(err.response?.data?.message || 'Failed to fetch movie details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleBooking = async () => {
    if (!selectedSeats.length || !selectedDate) {
      setError('Please select at least one seat and a date');
      return;
    }

    try {
      // Get user ID from the token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to book tickets');
        navigate('/auth');
        return;
      }

      const bookingData = {
        movieName: movie._id,
        seatNumber: selectedSeats.join(','),
        date: new Date(selectedDate).toISOString(),
        user: JSON.parse(localStorage.getItem('user')).id
      };

      console.log('Creating booking with data:', bookingData);
      const response = await bookingService.createBooking(bookingData);
      console.log('Booking response:', response);

      if (response.data && response.data.message === 'Booking successful') {
        setBookingSuccess(true);
        // Redirect to movies page after 2 seconds
        setTimeout(() => {
          navigate('/movies');
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Booking was not successful');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return <div className="booking-container">Loading...</div>;
  }

  if (error) {
    return <div className="booking-container error">{error}</div>;
  }

  if (bookingSuccess) {
    return (
      <div className="booking-container success">
        <h2>Booking Successful!</h2>
        <p>Your seats have been booked. Redirecting to movies page...</p>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="movie-info">
        <h2>{movie?.title}</h2>
        <img src={movie?.posterUrl} alt={movie?.title} />
        <p>{movie?.description}</p>
      </div>

      <div className="booking-form">
        <div className="date-selection">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="seat-selection">
          <h3>Select Seats</h3>
          <div className="screen">Screen</div>
          <div className="seats-grid">
            {seats.map(seat => (
              <button
                key={seat}
                className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                onClick={() => handleSeatClick(seat)}
              >
                {seat}
              </button>
            ))}
          </div>
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Selected Seats: {selectedSeats.join(', ') || 'None'}</p>
          <p>Date: {selectedDate || 'Not selected'}</p>
          <p>Total Price: ${selectedSeats.length * 10}</p>
        </div>

        <button 
          className="book-button"
          onClick={handleBooking}
          disabled={!selectedSeats.length || !selectedDate}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Booking; 