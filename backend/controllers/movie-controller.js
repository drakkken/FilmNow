import jwt from 'jsonwebtoken'
import { Movie } from '../models/movies.js';
import { Admin } from '../models/admin.js';
import mongoose from 'mongoose';

export const addMovie =async (req,res,next)=>{


    const extractedToken = req.headers.authorization?.split(" ")[1];
    if(!extractedToken || extractedToken.trim()=="")
    {
        return res.status(404).json({
            message:"token not found",
        })
    } 

    let adminId 
    
    //verify token
    
    try {
        const decrypted = jwt.verify(extractedToken, process.env.SECRET_KEY);
        adminId = decrypted.id;
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }



    //creating a new movie
    
      const { title, description, actors, releaseDate, posterUrl, featured } = req.body;
      if (
        !title || title.trim() === "" ||
        !description || description.trim() === "" ||
        !releaseDate || releaseDate.trim() === "" ||
        !posterUrl || posterUrl.trim() === ""
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    let movie;
    try{
        movie = new Movie({
            title,
            description,
            actors,
            releaseDate:new Date(`${releaseDate}`),
            posterUrl,
            featured,
            admin:adminId

        })
        
        const session = await mongoose.startSession();
        const adminUser = await Admin.findById(adminId);
        session.startTransaction();
        await movie.save({session});
        adminUser.addedMovies.push(movie);
        await adminUser.save({session})
        await session.commitTransaction();
        




       

    }catch(err)
    {
        return console.log(err)
    }
    if(!movie)
    {
        return res.status(500).json({
            message:'failed to add movie'
        })
    }

    return res.status(201).json({
        movie
    })
}


export const getAllMovies = async(req,res,next)=>{
    let movies;
    try {
        movies = await Movie.find();
    } catch (err) {
        return next(err);
    }
    if (!movies || movies.length === 0) {
        return res.status(404).json({ message: "No movies found" });
    }
    return res.status(200).json({ movies }); 
}

export const getMovieById = async(req,res,next)=>{
    const { id } = req.params;
    let movie;
    try {
        movie = await Movie.findById(id);
    } catch (err) {
        return next(err);
    }
    if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
    }
    return res.status(200).json({ movie });
}