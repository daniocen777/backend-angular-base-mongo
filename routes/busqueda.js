/* Ruta para realizar la búsqueda de cualquier colección */
var express = require("express");
var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

// Inicializar variables
var app = express();

/* =================================================== */
/* Obtener los datos de las colecciones o de una tabla*/
/* =================================================== */
app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
  let busqueda = req.params.busqueda;
  let tabla = req.params.tabla;
  let regex = new RegExp(busqueda, "i");
  let promesa;
  switch (tabla) {
    case "usuarios":
      promesa = buscarUsuarios(busqueda, regex);
      break;
    case "medicos":
      promesa = buscarMedicos(busqueda, regex);
      break;
    case "hospitales":
      promesa = buscarHospitales(busqueda, regex);
      break;

    default:
      return res.status(400).json({
        ok: false,
        mensaje: "Sólo se puede buscar los usuarios, hospitales y médicos",
        error: { message: "Colección no válida" }
      });
  }
  promesa.then(data => {
    res.status(200).json({
      ok: true,
      [tabla]: data
    });
  });
});

/* ===================================== */
/* Obtener los datos de la búsqueda*/
/* ===================================== */
app.get("/todo/:busqueda", (req, res, next) => {
  // Extraer el parámetro de búsqueda => lo que escribe el usuario
  let busqueda = req.params.busqueda;
  let regex = new RegExp(busqueda, "i"); // expresión regular. i => insensible a mayus y minus
  // Varias promesas disparadas
  Promise.all([
    buscarHospitales(busqueda, regex),
    buscarMedicos(busqueda, regex),
    buscarUsuarios(busqueda, regex)
  ]).then(respuestas => {
    res.status(200).json({
      ok: true,
      hospitales: respuestas[0],
      medicos: respuestas[1],
      usuarios: respuestas[2]
    });
  });
});

// Promesa
function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .exec((err, hospitales) => {
        if (err) {
          reject("Error al cargar hospitales", err);
        } else {
          resolve(hospitales);
        }
      });
  });
}

function buscarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .populate("hospital")
      .exec((err, medicos) => {
        if (err) {
          reject("Error al cargar medicos", err);
        } else {
          resolve(medicos);
        }
      });
  });
}

// Búsqueda de usuario por nombre y el correo
function buscarUsuarios(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({}, "nombre emial role")
      .or([{ nombre: regex }, { email: regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject("Error al buscar usuarios", err);
        } else {
          resolve(usuarios);
        }
      });
  });
}

module.exports = app;
