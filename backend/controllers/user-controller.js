import { User } from "../models/User.js";
import bcrypt from 'bcryptjs'
export const getAllUsers = async(req,res,next)=>{
    let users;
    try{
        users = await User.find()
    }catch(error)
    {
        return next(error)
    }

    if(!users){
        return res.status(500).res.json({
            message:"unexpected Error occred"

        })
    }


    return res.status(200).json({
        users
    })
}

export const signUp = async(req,res,next)=>{
  const {name,email,password} = req.body;
  if(!name || name.trim()=="" || !email ||email.trim()==""||  !password || password.trim()=="" )
  {
    return res.status(440).json({
        message:"invalid data"
    })
  }
  const hashedPassword =  bcrypt.hashSync(password,10)
  let created;
  try{
    created = new User({name,email,password:hashedPassword})
    await created.save()
  }catch(err)
  {
    return next(err)
  }
  if(!created)
  {
    return res.status(440).json({message:'unexptected eror'})
  }
  res.status(201).json({created})
}

export const updateUser= async(req,res,next)=>{

  const id = req.params.id
  const {name,email,password} = req.body;
  if(!name || name.trim()=="" || !email ||email.trim()==""||  !password || password.trim()=="" )
  {
    return res.status(440).json({
        message:"invalid data"
    })
  }
  const hashedPassword =  bcrypt.hashSync(password,10)
  let updated;
  try{
     updated = await User.findByIdAndUpdate(id,{name,email,password:hashedPassword})
  }catch(err)
  {
    return console.log(err)
  }
  if(!updated)
  {
    res.status(500).json({
      message:'error coudl not update the user specified'
    })
  }
   res.status(200).json({message:'updated succesfully',updated})

}

export const deleteUser = async(req,res,next)=>{

  const id = req.params.id;
  let del;
  try{
    del = await User.findByIdAndDelete(id);
  }catch(err)
  {
    console.log(err)
  }
  if(!del)
  {
    return res.status(500).json({message:'error could not delete'})

  }
  res.status(200).json({message:'deleted sucesfully',
    del
  })
}

export const login = async(req,res,next)=>{
   const {email,password} = req.body;



   if(!email ||email.trim()==""||!password||password.trim()=='')
  {
    return res.status(440).json({
        message:"invalid data"
    })
  }
  let existingUser;
  try{
    existingUser= await  User.findOne({email})
  }catch(err)
  {
    return res.json(440).json({message:'unable to find user from id'})
  }

  const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);

  if(!isPasswordCorrect)
  {
    console.log('wring password')
    return res.status(400).json({message:'incorrect password'})
  }


  return res.status(200).json({message:'login successfull',
    user:{
      name:existingUser.name,
      email:existingUser.email,
      password:existingUser.password
    }
  })
}

export const getBookingOfUser = async(req,res,next)=>{
  const id = req.params.id;
  let userBookings;
  try{
    userBookings = await User.findById(id);
  }catch(err)
  {
    return next(err)
  }
  if(!userBookings)
  {
    return res.status(404).json({message:'no bookings found'})
  }
  return res.status(200).json({userBookings})
}