import React, { useState, useEffect } from 'react';
import { movieService } from '../../services/api';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    actors: '',
    releaseDate: '',
    posterUrl: '',
    featured: false
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieService.getAllMovies();
      setMovies(response.movies || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      showAlert('Error fetching movies', 'error');
    }
  };

  const handleOpen = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        ...movie,
        actors: movie.actors.join(', '),
        releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0]
      });
    } else {
      setEditingMovie(null);
      setFormData({
        title: '',
        description: '',
        actors: '',
        releaseDate: '',
        posterUrl: '',
        featured: false
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMovie(null);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'featured' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const movieData = {
        ...formData,
        actors: formData.actors.split(',').map(actor => actor.trim())
      };

      if (editingMovie) {
        await movieService.updateMovie(editingMovie._id, movieData);
        showAlert('Movie updated successfully');
      } else {
        await movieService.addMovie(movieData);
        showAlert('Movie added successfully');
      }

      handleClose();
      fetchMovies();
    } catch (error) {
      console.error('Error saving movie:', error);
      showAlert(error.response?.data?.message || 'Error saving movie', 'error');
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieService.deleteMovie(movieId);
        showAlert('Movie deleted successfully');
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
        showAlert(error.response?.data?.message || 'Error deleting movie', 'error');
      }
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" className="admin-dashboard">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Movie Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Movie
        </Button>
      </Box>

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie._id}>
            <Card className="movie-card">
              <CardMedia
                component="img"
                height="200"
                image={movie.posterUrl}
                alt={movie.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {movie.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <IconButton onClick={() => handleOpen(movie)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(movie._id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMovie ? 'Edit Movie' : 'Add New Movie'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Actors (comma-separated)"
              name="actors"
              value={formData.actors}
              onChange={handleChange}
              required
              margin="normal"
              helperText="Enter actor names separated by commas"
            />
            <TextField
              fullWidth
              label="Release Date"
              name="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={handleChange}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Poster URL"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleChange}
              required
              margin="normal"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.featured}
                  onChange={handleChange}
                  name="featured"
                />
              }
              label="Featured Movie"
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingMovie ? 'Update' : 'Add'} Movie
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard; 