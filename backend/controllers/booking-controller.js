import { Booking } from "../models/bookings.js";
import { Movie } from "../models/movies.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";

export const newBooking = async (req, res, next) => {
    const { movieName, seatNumber, date, user } = req.body;

    let existingMovie;
    let existingUser;
    try{
        existingMovie = await Movie.findById(movieName)
        existingUser = await User.findById(user);
    }catch(err)
    {
        return console.log(err)
    }
   if (!existingMovie) {
        return res.status(404).json({ message: "Movie not found" });
    }
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    if (
         !movieName||
        !seatNumber  ||
        !date || date.trim() === "" ||
        !user 
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
    }

    let booking;
    try {
        booking = new Booking({
            movieName,
            seatNumber,
            date: bookingDate,
            user
        });
        const session  = await mongoose.startSession();
        session.startTransaction()
       
        //transactions taqking place
        existingUser.bookings.push(booking)
        existingMovie.bookings.push(booking)
        //
        //saving in the same session 
         await existingUser.save({session})
         await existingMovie.save({session})
         await booking.save({session})


        await  session.commitTransaction()
        session.endSession();




        
    } catch (err) {
        return next(err);
    }

    if (!booking) {
        return res.status(500).json({ message: "Failed to create booking" });
    }

    return res.status(201).json({message:"booking succesfull", booking });
};

export const getBookingById = async (req, res, next) => {
    const { id } = req.params;
    let booking;
    try {
        booking = await Booking.findById(id);
    } catch (err) {
        return next(err);
    }
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ booking });
};


export const deleteBooking = async (req, res, next) => {
    const { id } = req.params;
    let booking;
    try {
        booking = await Booking.findByIdAndRemove(id).populate("user").populate("movieName ");
        
        const session = await mongoose.startSession();
        session.startTransaction()
       await booking.user.bookings.pull(booking);
       await booking.movieName.bookings.pull(booking);
         await booking.user.save({ session });
        await booking.movieName.save({ session });
        session.commitTransaction();
        session.endSession();
        







    } catch (err) {
        return next(err);
    }
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ message: "Booking deleted successfully", booking });
};