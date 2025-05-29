import express from 'express'
import { addMovie, getAllMovies, getMovieById, updateMovie, deleteMovie } from '../controllers/movie-controller.js';

const movieRouter = express.Router();

movieRouter.post("/",addMovie)
movieRouter.get("/",getAllMovies)
movieRouter.get("/:id",getMovieById)
movieRouter.put("/:id", updateMovie)
movieRouter.delete("/:id", deleteMovie)




export default movieRouter