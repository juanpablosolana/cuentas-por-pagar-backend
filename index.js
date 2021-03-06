require ('./db')
const Registros = require('./models/fetchData')
const express = require('express')
const app = express()
const cors = require('cors')
const fileUpload = require("express-fileupload");
const CfdiToJson = require("cfdi-to-json");
const soapRequest = require('easy-soap-request');
const fs = require("fs");
const token = require('./middelware/token')
const usersRouter = require('./controllers/users')
const usersLogin = require("./controllers/login");
const { Mongoose } = require('mongoose')
const convert = require('xml-js');

app.use(cors())
app.use(express.json())
app.use(fileUpload());

// Custom API xml to JSON //
let cfdiJson = [];


app.get("/api/v1/cfdi",token, (request, response) => {
  fs.readdir("./files", function (err, archivos) {
    if (err) {
      onError(err);
      return;
    }
    archivos.forEach((element) => {
      cfdiJson.push(
        (jsonCfdi = CfdiToJson.parse({ path: `./files/${element}` }))
      );
    });
  });
  response.send(cfdiJson);
  cfdiJson=[]
});

// app.get("/api/v1/cfdi/validador/:re&&:rr&&:tt&&:id",(request, res)=>{
//   const {re,rr,tt,id} = request.params
//   const url = 'https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc';
//   const sampleHeaders = {
//     'user-agent': 'sampleTest',
//     'Content-Type': 'text/xml;charset=UTF-8',
//     'soapAction': 'http://tempuri.org/IConsultaCFDIService/Consulta',
//   };
//   const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
//      <soapenv:Header/>
//      <soapenv:Body>
//         <tem:Consulta>
//            <!--Optional:-->
//            <tem:expresionImpresa><![CDATA[?re=${re}&rr=${rr}&tt=${tt}&id=${id}]]>
//            </tem:expresionImpresa>
//         </tem:Consulta>
//      </soapenv:Body>
//   </soapenv:Envelope>`;

//   const data = async () => {
//     const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml });
//     const { body } = response;
//     res.send(convert.xml2json(body, { compact: true, spaces: 4 }))
//   }
//   data()
// })


// main //
app.post("/api/registros",token, (request, response) => {
    Registros.find({}).then((registros) => {
      response.json(registros);
    });
});

app.post("/api/registros/id/:id",token, (request, response,next) => {
 const {id} = request.params
  Registros.findById(id).then(registros => {
    registros? response.json(registros):response.status(404).end()
  }).catch(err=>{
   next(err)
  });
});

////      upload files ///

app.post("/upload",token, (req, res) => {
  // console.log(req.headers)
  let EDFile = req.files.file;
  EDFile.mv(`./files/${EDFile.name}`, (err) => {
    if (err) return res.status(500).send({ message: err });
    return res.status(200).send({ message: "Archivo guardado"});
  });
});


app.use((error,request,response,next)=>{
  console.log(error.name);
  response.status(400).end();
  Mongoose.console()
})


app.post("/api/registros/nombre/:nombre",token, (request, response, next) => {
  // console.log(request.headers);
  const { nombre } = request.params;
  Registros.find({ "NumeroEmpleado":nombre  })
    .then((registros) => {
      registros ? response.json(registros) : response.status(404).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.use((error, request, response, next) => {
  console.log(error.name);
  response.status(400).end();
  // Mongoose.close();
});


app.use("/api/usuarios", usersRouter);
app.use("/api/login", usersLogin);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("server corriendo en el puerto", PORT);
});