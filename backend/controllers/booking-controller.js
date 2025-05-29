import { Booking } from "../models/bookings.js";
import { Movie } from "../models/movies.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";

export const newBooking = async (req, res, next) => {
    const { movieName, seatNumber, date, user } = req.body;

    if (!movieName || !seatNumber || !date || !user) {
        return res.status(400).json({ message: "All fields are required" });
    }

    let existingMovie;
    let existingUser;
    try {
        existingMovie = await Movie.findById(movieName);
        existingUser = await User.findById(user);
    } catch (err) {
        console.error('Error finding movie or user:', err);
        return res.status(500).json({ message: "Error finding movie or user" });
    }

    if (!existingMovie) {
        return res.status(404).json({ message: "Movie not found" });
    }
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
    }

    let booking;
    try {
        booking = new Booking({
            movieName: existingMovie._id,
            seatNumber,
            date: bookingDate,
            user: existingUser._id
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        
        existingUser.bookings.push(booking);
        existingMovie.bookings.push(booking);
        
        await existingUser.save({ session });
        await existingMovie.save({ session });
        await booking.save({ session });

        await session.commitTransaction();
        session.endSession();
    } catch (err) {
        console.error('Error creating booking:', err);
        return res.status(500).json({ message: "Failed to create booking" });
    }

    return res.status(201).json({
        message: "Booking successful",
        booking: {
            id: booking._id,
            movieName: existingMovie.title,
            seatNumber,
            date: bookingDate,
            user: existingUser.name
        }
    });
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

export const getUserBookings = async (req, res, next) => {
    try {
        const userId = req.params.id; // Get user ID from the URL parameter
        console.log('Fetching bookings for user:', userId);
        
        const bookings = await Booking.find({ user: userId })
            .populate('movieName', 'title posterUrl')
            .sort({ date: -1 }); // Sort by date, newest first
            
        console.log('Found bookings:', bookings);
        return res.status(200).json({ bookings });
    } catch (err) {
        console.error('Error fetching user bookings:', err);
        return res.status(500).json({ message: "Failed to fetch user bookings" });
    }
};