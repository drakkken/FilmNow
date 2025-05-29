import { useState, useEffect } from 'react';
import { movieService, userService } from '../../services/api';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMovie, setNewMovie] = useState({
    title: '',
    genre: '',
    rating: '',
    poster: '',
  });

  useEffect(() => {
    if (activeTab === 'movies') {
      fetchMovies();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchMovies = async () => {
    try {
      const response = await movieService.getAllMovies();
      setMovies(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch movies');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      await movieService.addMovie(newMovie);
      setNewMovie({ title: '', genre: '', rating: '', poster: '' });
      fetchMovies();
    } catch (err) {
      setError('Failed to add movie');
    }
  };

  const handleMovieChange = (e) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          Movies
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'movies' && (
        <div className="movies-section">
          <h2>Add New Movie</h2>
          <form onSubmit={handleMovieSubmit} className="movie-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={newMovie.title}
                onChange={handleMovieChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Genre</label>
              <input
                type="text"
                name="genre"
                value={newMovie.genre}
                onChange={handleMovieChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <input
                type="number"
                name="rating"
                value={newMovie.rating}
                onChange={handleMovieChange}
                min="0"
                max="10"
                step="0.1"
                required
              />
            </div>
            <div className="form-group">
              <label>Poster URL</label>
              <input
                type="url"
                name="poster"
                value={newMovie.poster}
                onChange={handleMovieChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Add Movie
            </button>
          </form>

          <h2>Movie List</h2>
          <div className="movie-list">
            {movies.map((movie) => (
              <div key={movie._id} className="movie-item">
                <img
                  src={movie.poster || 'https://via.placeholder.com/150'}
                  alt={movie.title}
                  className="movie-thumbnail"
                />
                <div className="movie-details">
                  <h3>{movie.title}</h3>
                  <p>Genre: {movie.genre}</p>
                  <p>Rating: {movie.rating}/10</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>User List</h2>
          <div className="user-list">
            {users.map((user) => (
              <div key={user._id} className="user-item">
                <div className="user-details">
                  <h3>{user.name}</h3>
                  <p>Email: {user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
