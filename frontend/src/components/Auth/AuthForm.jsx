import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  Movie,
  Google,
  Facebook,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError('Name is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          };

      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
      
      if (response.data.success) {
        setSuccess(isLogin ? 'Login successful!' : 'Account created successfully!');
        
        // Store auth token if provided
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        // Redirect after success
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSocialAuth = (provider) => {
    // Implement social auth logic here
    console.log(`${provider} auth clicked`);
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Box sx={{ position: 'relative', mb: 2 }}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>

        <Paper 
          elevation={20}
          sx={{
            p: 4,
            background: 'linear-gradient(145deg, #2a2d36, #1e2125)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #FF512F 30%, #DD2476 90%)',
                  boxShadow: '0 4px 20px rgba(255, 81, 47, 0.3)'
                }}
              >
                <Movie sx={{ fontSize: 32, color: 'white' }} />
              </Box>
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'white', 
                fontWeight: '700',
                mb: 1
              }}
            >
              MovieBooker
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: '400'
              }}
            >
              {isLogin ? 'Welcome back!' : 'Join us today'}
            </Typography>
          </Box>

          {/* Auth Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                p: 0.5,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Button
                onClick={() => setIsLogin(true)}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                  color: isLogin ? 'white' : 'rgba(255, 255, 255, 0.6)',
                  background: isLogin 
                    ? 'linear-gradient(45deg, #FF512F 30%, #DD2476 90%)'
                    : 'transparent',
                  boxShadow: isLogin ? '0 2px 10px rgba(255, 81, 47, 0.3)' : 'none',
                  '&:hover': {
                    background: isLogin 
                      ? 'linear-gradient(45deg, #FF512F 10%, #DD2476 70%)'
                      : 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => setIsLogin(false)}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                  color: !isLogin ? 'white' : 'rgba(255, 255, 255, 0.6)',
                  background: !isLogin 
                    ? 'linear-gradient(45deg, #FF512F 30%, #DD2476 90%)'
                    : 'transparent',
                  boxShadow: !isLogin ? '0 2px 10px rgba(255, 81, 47, 0.3)' : 'none',
                  '&:hover': {
                    background: !isLogin 
                      ? 'linear-gradient(45deg, #FF512F 10%, #DD2476 70%)'
                      : 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>

          {/* Error/Success Messages */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                background: 'rgba(244, 67, 54, 0.1)',
                color: '#ff6b6b',
                border: '1px solid rgba(244, 67, 54, 0.3)'
              }}
            >
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                background: 'rgba(76, 175, 80, 0.1)',
                color: '#4caf50',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}
            >
              {success}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {!isLogin && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF512F',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.6)',
                        '&.Mui-focused': {
                          color: '#FF512F',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'white',
                      },
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF512F',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&.Mui-focused': {
                        color: '#FF512F',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>

              {!isLogin && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF512F',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.6)',
                        '&.Mui-focused': {
                          color: '#FF512F',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'white',
                      },
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF512F',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&.Mui-focused': {
                        color: '#FF512F',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>

              {!isLogin && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF512F',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.6)',
                        '&.Mui-focused': {
                          color: '#FF512F',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'white',
                      },
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    background: 'linear-gradient(45deg, #FF512F 30%, #DD2476 90%)',
                    boxShadow: '0 4px 20px rgba(255, 81, 47, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF512F 10%, #DD2476 70%)',
                      boxShadow: '0 6px 25px rgba(255, 81, 47, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Social Auth */}
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ 
              '&::before, &::after': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}>
              <Chip 
                label="OR" 
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }} 
              />
            </Divider>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  onClick={() => handleSocialAuth('google')}
                  sx={{
                    py: 1.5,
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      background: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Facebook />}
                  onClick={() => handleSocialAuth('facebook')}
                  sx={{
                    py: 1.5,
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      background: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Facebook
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography 
              variant="body2" 
              sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button
                onClick={toggleAuthMode}
                sx={{
                  color: '#FF512F',
                  textTransform: 'none',
                  fontWeight: '600',
                  p: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    background: 'transparent',
                    color: '#DD2476'
                  }
                }}
              >
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthForm;