const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User')

userRouter.post('/', async(request, response)=>{
  const {body}=request
  const {username, password} = body

  const saltRounds=10
  const search = await User.findOne({ username });
  if(search === null){
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      passwordHash,
    });
    const savedUser = await user.save();
    response.json(savedUser);
  } else {
     response.status(401).json({
       error: "Error el usuario ya se encuentra registrado",
     });
  }



})

module.exports = userRouter