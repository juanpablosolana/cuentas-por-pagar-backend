const jwt = require("jsonwebtoken");

module.exports=(request, response, next) =>{
  const autorization = request.get("Authorization");
  // console.log (autorization)
  if (!autorization) {
    return response.status(401).json({ error: "Sin token o es invalido" });
  }
  if (autorization && autorization.toLowerCase().startsWith("bearer")) {
    token = autorization.substring(7);
  }
  let realToken = {};
  // console.log(token)
  try {
    realToken = jwt.verify(token, process.env.cs);
    // console.log(realToken)
  } catch {
    (e) => console.log(e);
  }
  // console.log(token, realToken.id)
  if (!token || !realToken.id) {
    return response.status(401).json({ error: "Sin token o es invalido" });
  }
  // request.userId = userId
  next()
}