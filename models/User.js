const {Schema, model, connection} = require('mongoose')
const userSchema = new Schema({
  username: String,
  passwordHash: String,
});

// const Registros = model('Registros', registros)

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
});
 const User = model('User', userSchema)

module.exports = User;

