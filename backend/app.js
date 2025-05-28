import express from 'express'
import dotenv from 'dotenv'
import { connectToDb } from './db/db.js';
import userRouter from './routes/user-routes.js';
import adminRouter from './routes/admin-routes.js';
import movieRouter from './routes/movie-routes.js';
import bookingRouter from './routes/booking-routes.js';
dotenv.config();
const app = express();
app.use(express.json())

//middlewares
app.use("/users",userRouter)
app.use("/admin",adminRouter)
app.use("/movies",movieRouter)
app.use("/bookings",bookingRouter)


connectToDb();
app.listen(process.env.PORT,()=>{
    console.log(`port running on ${process.env.PORT}`)
}
)