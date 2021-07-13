const dotenv = require("dotenv");
const {connect}  = require("mongoose");
dotenv.config();
connect(process.env.cs, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    console.log("conexion realizada");
  })
  .catch((err) => {
    console.error(err);
  });
