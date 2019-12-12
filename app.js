// Importación de librerías
var express = require("express");
var mongoose = require("mongoose"); // mongoose

// Inicializar variables
var app = express();

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
app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: true,
    mensaje: "¡Petición realizada correctamente!"
  });
});

// Escuchar peticiones
app.listen(3000, () => {
  console.log("Express server en el puerto 3000: \x1b[32m%s\x1b[0m", "online");
});
