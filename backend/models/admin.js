import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        
    },
    password:{
        type:String,
        required:[true,"password for admin is required"],
        minLength:6

    },
    addedMovies:[{
        type:mongoose.Types.ObjectId,
        ref:"Movie"
    }]
})


export const Admin = mongoose.model('Admin',adminSchema)