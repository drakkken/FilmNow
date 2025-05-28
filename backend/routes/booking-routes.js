import express, { Router } from 'express'
import { getBookingById, newBooking } from '../controllers/booking-controller.js'

const bookingRouter = Router()


bookingRouter.post("/",newBooking)
bookingRouter.get("/:id",getBookingById)




export default bookingRouter