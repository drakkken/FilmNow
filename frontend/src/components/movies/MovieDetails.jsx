import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../../services/api';
import { Container, Typography, Box, Button, Grid, Chip, CircularProgress } from '@mui/material';
import { Calendar, Clock, Star, Users, ArrowLeft } from 'lucide-react';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await movieService.getMovieById(id);
        console.log('Movie details response:', response);
        if (!response || !response.movie) {
          throw new Error('Invalid movie data received');
        }
        setMovie(response.movie);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError(err.response?.data?.message || 'Failed to fetch movie details');
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBooking = () => {
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="error">{error || 'Movie not found'}</Typography>
        <Button 
          startIcon={<ArrowLeft />} 
          onClick={() => navigate('/movies')}
          sx={{ mt: 2 }}
        >
          Back to Movies
        </Button>
      </Box>
    );
  }

  return (
    <Box className="movie-details">
      <Container>
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => navigate('/movies')}
          sx={{ mb: 4 }}
        >
          Back to Movies
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box className="poster-container">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="movie-poster"
              />
              {movie.featured && (
                <Chip
                  icon={<Star size={16} />}
                  label="Featured"
                  className="featured-chip"
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box className="movie-info">
              <Typography variant="h3" className="movie-title">
                {movie.title}
              </Typography>

              <Box className="movie-meta">
                <Box className="meta-item">
                  <Calendar size={20} />
                  <Typography>{new Date(movie.releaseDate).toLocaleDateString()}</Typography>
                </Box>
                {movie.duration && (
                  <Box className="meta-item">
                    <Clock size={20} />
                    <Typography>{movie.duration} min</Typography>
                  </Box>
                )}
                {movie.rating && (
                  <Box className="meta-item">
                    <Star size={20} />
                    <Typography>{movie.rating}/10</Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="h6" className="section-title">
                Description
              </Typography>
              <Typography className="movie-description">
                {movie.description}
              </Typography>

              <Typography variant="h6" className="section-title">
                Cast
              </Typography>
              <Box className="actors-list">
                {movie.actors.map((actor, index) => (
                  <Chip
                    key={index}
                    label={actor}
                    className="actor-chip"
                  />
                ))}
              </Box>

              <Button
                variant="contained"
                size="large"
                className="book-button"
                onClick={handleBooking}
              >
                Book Tickets
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetails; 