import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  useTheme
} from '@mui/material';
import { 
  Play, 
  Star, 
  Calendar, 
  Search, 
  Filter,
  ArrowLeft,
  Clock
} from 'lucide-react';
import axios from 'axios';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(12);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/movies');
        setMovies(response.data.movies);
        setFilteredMovies(response.data.movies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let filtered = [...movies];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterBy !== 'all') {
      if (filterBy === 'featured') {
        filtered = filtered.filter(movie => movie.featured);
      } else if (filterBy === 'recent') {
        const currentYear = new Date().getFullYear();
        filtered = filtered.filter(movie => 
          new Date(movie.releaseDate).getFullYear() >= currentYear - 1
        );
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'releaseDate':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [movies, searchTerm, sortBy, filterBy]);

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
        {movie.featured && (
          <Chip
            icon={<Star size={14} />}
            label="Featured"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#FF512F',
              color: 'white',
              fontSize: '0.75rem',
              height: '24px'
            }}
          />
        )}
        {movie.rating && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Star size={12} fill="gold" color="gold" />
            {movie.rating}/10
          </Box>
        )}
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Calendar size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
          <Typography 
            variant="body2" 
            sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}
          >
            {new Date(movie.releaseDate).getFullYear()}
          </Typography>
          {movie.duration && (
            <>
              <Clock size={14} style={{ color: 'rgba(255,255,255,0.6)', marginLeft: '8px' }} />
              <Typography 
                variant="body2" 
                sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}
              >
                {movie.duration} min
              </Typography>
            </>
          )}
        </Box>

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
            mb: 2
          }}
        >
          {movie.description}
        </Typography>

        <Button
          variant="contained"
          size="small"
          startIcon={<Play size={14} />}
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            handleMovieClick(movie._id);
          }}
          sx={{ 
            background: 'linear-gradient(45deg, #FF512F 30%, #DD2476 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF512F 10%, #DD2476 70%)',
            }
          }}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );

  // Pagination
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        py: 4
      }}>
        <Container>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowLeft />}
              onClick={() => navigate('/')}
              sx={{ 
                color: 'white',
                mr: 3,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Back to Home
            </Button>
            <Typography 
              variant="h3" 
              sx={{ 
                color: '#ffffff',
                fontWeight: '700',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              All Movies
            </Typography>
          </Box>

          {/* Search and Filter Controls */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    </InputAdornment>
                  ),
                  style: { 
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF512F',
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Filter By</InputLabel>
                <Select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  label="Filter By"
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF512F',
                    },
                  }}
                >
                  <MenuItem value="all">All Movies</MenuItem>
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="recent">Recent Releases</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF512F',
                    },
                  }}
                >
                  <MenuItem value="title">Title (A-Z)</MenuItem>
                  <MenuItem value="releaseDate">Release Date</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Results Summary */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              mb: 2
            }}
          >
            Showing {currentMovies.length} of {filteredMovies.length} movies
            {searchTerm && ` for "${searchTerm}"`}
          </Typography>
        </Container>
      </Box>

      {/* Movies Grid */}
      <Container sx={{ py: 4 }}>
        {currentMovies.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                mb: 2
              }}
            >
              No movies found
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255,255,255,0.5)',
                mb: 3
              }}
            >
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setFilterBy('all');
                setSortBy('title');
              }}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)'
              }}
            >
              Clear Filters
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {currentMovies.map((movie) => (
                <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 6
              }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#FF512F',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#DD2476',
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default MoviesPage;