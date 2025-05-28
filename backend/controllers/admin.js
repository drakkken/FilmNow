import { Admin } from "../models/admin.js";
import bcrypt from 'bcryptjs'
import  jwt from 'jsonwebtoken'


export const addAdmin = async(req,res,next)=>{
   
    const {email,password} = req.body;

    if (!email || email.trim() === "" || !password || password.trim() === "") {
        return res.status(400).json({ message: "Email and password are required" });
    }
   
   
    let existing;
    try{
        existing = await Admin.findOne({email})
    }catch(err)
    {
        return res.status(500).json({msg:'alredy exist'})
    }

    if(existing){
        return res.status(400).json({message:"admin already exist"})

    }
    let admin;
    const hashedPassword = bcrypt.hashSync(password,10);
    try{
       admin =  new Admin({email,password:hashedPassword})
         await admin.save()
    }catch(err)
    {
        return console.log(err)
    }

    if(!admin)
    {
        res.status(201).json({admin})
        

    }


    res.status(200).json({
        message:'admin created',
        admin
    })
}  

export const adminLogin =async(req ,res ,next)=>{

    const {email,password} = req.body;
     if (!email || email.trim() === "" || !password || password.trim() === "") {
        return res.status(400).json({ message: "Email and password are required" });
    }

    let ex;
    try{
        ex = await Admin.findOne({email})
    }catch(err)
    {
        return console.log(err);
    }
    if(!ex)
    {
        return res.status(400).json({message:'admin not found'})

    }

    const correctPassword = bcrypt.compareSync(password,ex.password)
    if(!correctPassword){
        return res.status(400).json({message:'incorrect password'})

    }

    const token  = jwt.sign({id:ex._id},process.env.SECRET_KEY,{
        expiresIn:"1d",

    })
    res.status(200).json({message:'authentication complete',token,id:ex._id}) 
}

export const getAllAdmins = async (req, res, next) => {
    let admins;
    try {
        admins = await Admin.find();
    } catch (err) {
        return next(err);
    }
    if (!admins || admins.length === 0) {
        return res.status(404).json({ message: "No admins found" });
    }
    return res.status(200).json({ admins });
};