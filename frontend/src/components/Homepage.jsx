import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  Chip,
  useTheme
} from '@mui/material';
import { Play, Star, Calendar, Ticket } from 'lucide-react';
import axios from 'axios';
import './Homepage.css';

const Homepage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/movies');
        setMovies(response.data.movies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const FeaturedMovie = ({ movie }) => {
    const parallaxOffset = scrollPosition * 0.5;
    
    return (
      <Box
        sx={{
          position: 'relative',
          height: '80vh',
          width: '100%',
          overflow: 'hidden',
          mb: 6
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.9))',
            zIndex: 1
          }}
        />
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{
            width: '100%',
            height: '120%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `translateY(${parallaxOffset}px) scale(1.1)`,
            transition: 'transform 0.1s ease-out'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1920x1080?text=No+Image';
          }}
        />
        <Container 
          sx={{ 
            position: 'relative', 
            zIndex: 2, 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center',
            transform: `translateY(${scrollPosition * 0.2}px)`,
            opacity: Math.max(0, 1 - scrollPosition / 500),
            transition: 'transform 0.1s ease-out'
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                color="white" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {movie.title}
              </Typography>
              <Typography 
                variant="h6" 
                color="white" 
                sx={{ 
                  mb: 2,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {movie.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip
                  icon={<Calendar size={16} />}
                  label={new Date(movie.releaseDate).getFullYear()}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    backdropFilter: 'blur(4px)',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }}
                  variant="outlined"
                />
                {movie.featured && (
                  <Chip
                    icon={<Star size={16} />}
                    label="Featured"
                    sx={{ 
                      color: 'white', 
                      borderColor: 'white',
                      backdropFilter: 'blur(4px)',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }}
                    variant="outlined"
                  />
                )}
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<Play />}
                onClick={() => navigate(`/booking/${movie._id}`)}
                sx={{ 
                  mr: 2,
                  background: 'linear-gradient(45deg, #FF512F 30%, #DD2476 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF512F 10%, #DD2476 70%)',
                  }
                }}
              >
                Book Now
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                More Info
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  };


  const handleMovieClick = (movieId) => {
    navigate(`/booking/${movieId}`);
  };

  const MovieCard = ({ movie }) => (
    <Card 
      onClick={() => handleMovieClick(movie._id)}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(145deg, #2a2d36, #1e2125)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(145deg, #343741, #23262b)',
          '& img': {
            transform: 'scale(1.08)'
          },
          '& .card-content': {
            background: 'linear-gradient(to top, #343741, rgba(52, 55, 65, 0.9))'
          }
        }
      }}
    >
      <Box 
        sx={{ 
          position: 'relative', 
          paddingTop: '150%',
          overflow: 'hidden',
          borderRadius: '12px 12px 0 0'
        }}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(42, 45, 54, 0.9), transparent)',
            pointerEvents: 'none'
          }}
        />
      </Box>
      <CardContent 
        className="card-content"
        sx={{ 
          flexGrow: 1,
          background: 'linear-gradient(to top, #2a2d36, rgba(42, 45, 54, 0.9))',
          transition: 'background 0.3s ease',
          p: 3
        }}
      >
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2"
          sx={{ 
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1.5
          }}
        >
          {movie.title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: 'rgba(255, 255, 255, 0.75)',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {movie.description}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#0f1419'
      }}>
        <CircularProgress sx={{ color: '#FF512F' }} />
      </Box>
    );
  }

  const featuredMovie = movies.find(movie => movie.featured);

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Welcome to MovieHub</h1>
        <p>Your ultimate destination for movie tickets and entertainment</p>
        <Link to="/movies" className="cta-button">
          Browse Movies
        </Link>
      </div>

      <div className="features-section">
        <div className="feature">
          <h3>Easy Booking</h3>
          <p>Book your movie tickets in just a few clicks</p>
        </div>
        <div className="feature">
          <h3>Wide Selection</h3>
          <p>Choose from a vast collection of movies</p>
        </div>
        <div className="feature">
          <h3>Secure Payments</h3>
          <p>Safe and secure payment processing</p>
        </div>
      </div>

      <div className="about-section">
        <h2>About MovieHub</h2>
        <p>
          MovieHub is your one-stop platform for booking movie tickets. We offer a
          seamless experience for movie enthusiasts to discover, book, and enjoy
          their favorite films. With our user-friendly interface and secure
          booking system, you can easily find and book tickets for the latest
          movies.
        </p>
      </div>

      <Box sx={{ 
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)',
        minHeight: '100vh'
      }}>
        {featuredMovie && <FeaturedMovie movie={featuredMovie} />}
        
        <Container sx={{ py: 8 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 6,
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '2.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              textAlign: 'center'
            }}
          >
            Latest Releases
          </Typography>
          <Grid container spacing={4}>
            {movies.map((movie) => (
              <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Homepage;