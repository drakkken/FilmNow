import express, { Router } from 'express'
import { getBookingById, newBooking, getUserBookings, deleteBooking } from '../controllers/booking-controller.js'
import { verifyToken } from '../middleware/auth.js'

const bookingRouter = Router()

// Protected routes
bookingRouter.post("/", verifyToken, newBooking)
bookingRouter.get("/:id", verifyToken, getUserBookings)
bookingRouter.delete("/:id", verifyToken, deleteBooking)

export default bookingRouter