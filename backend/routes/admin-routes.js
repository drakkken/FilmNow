import express, { Router } from 'express'
import { addAdmin, adminLogin, getAllAdmins } from '../controllers/admin.js';

const adminRouter = Router();
adminRouter.post("/add-admin",addAdmin)
adminRouter.post("/admin-login",adminLogin)
adminRouter.get("/",getAllAdmins)





export default adminRouter