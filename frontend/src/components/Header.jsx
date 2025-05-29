import {useState} from 'react'
import {AppBar, Autocomplete, Tabs,Tab, TextField, Toolbar} from '@mui/material'
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MovieIcon from '@mui/icons-material/Movie';
import { Link } from 'react-router-dom';
//import { fetchFunction } from '../api-helpers/api-helper.jsx';


const Header = () => {
  const [value,setValue] = useState(0);
  const [movies,setMovies] = useState([]);
  const getMovies = async () => {
     try {
        const response = await fetch("http://localhost:5000/movies");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMovies(data.movies);
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
  }


  //useEffect
  useEffect(() => {
   getMovies()

      
  }, []);






  return (
    <AppBar position="static" sx={{backgroundColor:'#2196f3'}}>
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" alignItems="center">
            <MovieIcon sx={{ fontSize: 30, marginRight: 1 }} />
            <h4>Movie Database</h4>
          </Box>
          <Box width="30%">
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={movies.map((option) => option.title)}
              renderInput={(params) => <TextField variant='standard' {...params} label="Search Movies" />}
            />
          </Box>
          <Tabs textColor='inherit' indicatorColor='secondary' value={value} onChange={(e,newValue)=>{
            setValue(newValue);
          }}>
            <Tab LinkComponent={Link} to="/movies" label="Movies" />
            <Tab LinkComponent={Link} to="/admin" label="Admin" />
            <Tab LinkComponent={Link} to="/auth" label="Auth" />  
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header