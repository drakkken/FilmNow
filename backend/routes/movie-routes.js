import express, { Router } from 'express'
import { addMovie, getAllMovies, getMovieById } from '../controllers/movie-controller.js';

const movieRouter = Router();

movieRouter.post("/",addMovie)
movieRouter.get("/",getAllMovies)
movieRouter.get("/:id",getMovieById)




export default movieRouter