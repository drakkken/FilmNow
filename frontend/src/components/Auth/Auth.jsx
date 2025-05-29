import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSuccess = (response) => {
    console.log('Auth success response:', response);
    const { token, user } = response;
    
    if (!token || !user) {
      console.error('Missing token or user data:', response);
      setError('Invalid response from server');
      return;
    }
    
    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Force a storage event to update the header
    const storageEvent = new StorageEvent('storage', {
      key: 'user',
      newValue: JSON.stringify(user),
      url: window.location.href
    });
    window.dispatchEvent(storageEvent);
    
    // Redirect to home
    navigate('/', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login with:', { email: formData.email });
        const response = await authService.login(formData);
        console.log('Login response:', response);
        handleAuthSuccess(response);
      } else {
        // Signup
        console.log('Attempting signup with:', { email: formData.email, name: formData.name });
        const response = await authService.signup(formData);
        console.log('Signup response:', response);
        if (response.token) {
          handleAuthSuccess(response);
        } else {
          // If signup doesn't return token, login after signup
          console.log('Signup successful, attempting login...');
          const loginResponse = await authService.login({
            email: formData.email,
            password: formData.password
          });
          console.log('Post-signup login response:', loginResponse);
          handleAuthSuccess(loginResponse);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="Enter your name"
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <p className="toggle-auth">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
