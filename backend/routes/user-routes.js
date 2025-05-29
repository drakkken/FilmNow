import express from 'express'
import { Router } from 'express'
import { deleteUser, getAllUsers, getBookingOfUser, login, signUp, updateUser } from '../controllers/user-controller.js';

const userRouter = Router();


userRouter.get("/get-all-users",getAllUsers)
userRouter.post("/sign-up",signUp)
userRouter.put("/:id",updateUser)
userRouter.delete("/:id",deleteUser)
userRouter.post("/login",login)
userRouter.get("/bookings/:id",getBookingOfUser)

export default userRouter;
