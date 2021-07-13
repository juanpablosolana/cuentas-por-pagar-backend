const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

loginRouter.post("/", async (request, response) => {
  const { body } = request;
  const { username, password } = body;
  const user= await User.findOne({username})
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect){
    response.status(401).json({
      error:'Usuario o contraseña no encontrados, verifique '
    })

  } else{



  const userForToken ={
    id: user._id,
    username: user.username
  }

  const token = jwt.sign(
    userForToken,
    process.env.cs,
  {
    expiresIn: 60 * 60 * 24
  }
  )

    response.send({
      username: user.username,
      token
    });
  }
});

module.exports = loginRouter;
