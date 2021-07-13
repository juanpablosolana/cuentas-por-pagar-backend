const {Schema, model, connection} = require('mongoose')
const registros = new Schema({
  NumeroEmpleado: String,
  Fecha: Date,
});

const Registros = model('Registros', registros)

registros.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  },
});

// Registros.find({})
//   .then((result) => {
//     console.log(result);
//     connection.close();
//   })
//   .catch((err) => {
//     console.log(err);
    // connection.close();
//   });
module.exports = Registros;

// const note = new Registros({
//   NumeroEmpleado: "Pepito Pelaez",
//   Fecha: new Date(),
// });

// note.save()
// .then(result=>{
//   console.log(result)
//   connection.close()
// }).catch(err=>{
//   console.log(err)
//   connection.close();
// })
