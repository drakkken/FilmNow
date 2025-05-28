import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

export async function connectToDb(){
    try{
        const connected = await mongoose.connect(process.env.MONGO_URL)
        if(!connected)
        {
            console.log("error cannot connect to mongo db")
        }
        console.log(`connected to db `)
    }catch(err)
    {
        console.log("error could not connect to db")
    }
}