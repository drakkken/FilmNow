import mongoose from "mongoose";


const user = mongoose.Schema({
    name:{
        type:String,
        required:[true,"pls enter a name"],
        minLength:2,
        maxLength:32,

    },
    email:{
        type:String,
        required:[true,"please enter the email"],
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please enter a valid email address"
        ],
        unique:true
    },
    password:{
        type:String,
        required:[true,"please enter a valid pasword"],
        minLength:6,
        maxLength:320,

    },
    bookings:[{type:mongoose.Types.ObjectId,ref:"Booking"}],
})


export const User = mongoose.model('User',user);
