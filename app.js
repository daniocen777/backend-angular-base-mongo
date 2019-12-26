// Importación de librerías
var express = require("express");
var mongoose = require("mongoose"); // mongoose
var bodyParser = require("body-parser"); // parser
mongoose.set("useFindAndModify", false);

// Inicializar variables
var app = express();
// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});
// body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse application/json

// Importando rutas
var appRoutes = require("./routes/app"); // principal
var loginRoutes = require("./routes/login"); // login
var usuarioRoutes = require("./routes/usuario"); // usaurios
var hospitalRoutes = require("./routes/hospital"); // usaurios
var medicoRoutes = require("./routes/medico"); // médicos
var busquedaRoutes = require("./routes/busqueda"); // búsquedas
var uploadRoutes = require("./routes/upload"); // subir archivos
var imagenesRoutes = require("./routes/imagenes"); // imágenes

// Conexión a la DB
mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (err, res) => {
    if (err) throw err; // Si hay error, se detiene la aplicación
    console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
  }
);

// rutas
app.use("/login", loginRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/medico", medicoRoutes);
app.use("/busqueda", busquedaRoutes);
app.use("/upload", uploadRoutes);
app.use("/img", imagenesRoutes);
app.use("/", appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
  console.log("Express server en el puerto 3000: \x1b[32m%s\x1b[0m", "online");
});
