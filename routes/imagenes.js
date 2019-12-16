/* Ruta para obtener las imágenes */
var express = require("express");
var fs = require("fs");

// Inicializar variables
var app = express();

app.get("/:tipo/:img", (req, res, next) => {
  let tipo = req.params.tipo;
  let img = req.params.img;
  let path = `./uploads/${tipo}/${img}`;
  fs.exists(path, existe => {
    // Si path no existe, imagen por defecto
    if (!existe) {
      path = "./assets/no-img.jpg";
    }

    res.sendfile(path, err => {
      console.log("ERROR =>", err);
    });
  });
});

module.exports = app;
