import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    movieName: {
        type: mongoose.Types.ObjectId,
        ref:"Movie",
        required: true
    },
    seatNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref:"User",
        required: true
    }
});

export const Booking = mongoose.model("Booking", bookingSchema);