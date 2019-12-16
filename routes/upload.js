/* Ruta para subir archivos */
var express = require("express");
var fileUpload = require("express-fileupload"); // para archivos
var fs = require("fs");
var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");

// Inicializar variables
var app = express();
// default options for files
app.use(fileUpload());

/* ===================================== */
/* Subir imagen de las colecciones */
/* ===================================== */
app.put("/:tipo/:id", (req, res, next) => {
  let tipo = req.params.tipo; // medico, hospital, usuario
  let id = req.params.id; // id del usuario, medico u hospital
  // Validar el tipo de colección
  let tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Colección no válida",
      error: {
        message: "Los tipos válidos son: " + tiposValidos.join(", ")
      }
    });
  }
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No se ha seleccionado una imagen",
      error: { message: "Debe seleccionar una imagen" }
    });
  }
  // Saber si es imagen y obtener el nombre del archivo
  let archivo = req.files.imagen;
  let nombreCortado = archivo.name.split(".");
  let extensionArchivo = nombreCortado[nombreCortado.length - 1];
  // Sólo las siguientes extensiones
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Extensión no válida",
      error: {
        message: "Las extensiones válidas son: " + extensionesValidas.join(", ")
      }
    });
  }
  // Nombre de archivo personalizado (id-random.png)
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
  // Mover archivo a un path
  let path = `./uploads/${tipo}/${nombreArchivo}`;
  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al mover rchivo",
        errors: err
      });
    }
    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuarios") {
    Usuario.findById(id, (err, usuario) => {
      // Validar id del usaurio si existe
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: "El usuario no existe",
          errors: err
        });
      }
      let oldPath = "./uploads/usuarios/" + usuario.img;
      // borrar la imagen antigua
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, err => {
          console.log("ERRROR => ", err);
        });
      }
      // Subir la nueva imagen
      usuario.img = nombreArchivo;
      usuario.save((err, usuarioActualizado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al actualziar imagen de usuario",
            errors: err
          });
        }
        usuarioActualizado.password = ":(";
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen de usuario actualizada",
          usuario: usuarioActualizado
        });
      });
    });
  }

  if (tipo === "medicos") {
    Medico.findById(id, (err, medico) => {
      // Validar id del médico si existe
      if (!medico) {
        return res.status(400).json({
          ok: false,
          mensaje: "El médico no existe",
          errors: err
        });
      }
      let oldPath = "./uploads/medicos/" + medico.img;
      // borrar la imagen antigua
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, err => {
          console.log("ERRROR => ", err);
        });
      }
      // Subir la nueva imagen
      medico.img = nombreArchivo;
      medico.save((err, medicoActualizado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al actualziar imagen de medico",
            errors: err
          });
        }

        return res.status(200).json({
          ok: true,
          mensaje: "Imagen de medico actualizada",
          medico: medicoActualizado
        });
      });
    });
  }

  if (tipo === "hospitales") {
    Hospital.findById(id, (err, hospital) => {
      // Validar id del usaurio si existe
      if (!hospital) {
        return res.status(400).json({
          ok: false,
          mensaje: "El hospital no existe",
          errors: err
        });
      }
      let oldPath = "./uploads/hospitales/" + hospital.img;
      // borrar la imagen antigua
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, err => {
          console.log("ERRROR => ", err);
        });
      }
      // Subir la nueva imagen
      hospital.img = nombreArchivo;
      hospital.save((err, hospitalActualizado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Error al actualziar imagen de hospital",
            errors: err
          });
        }

        return res.status(200).json({
          ok: true,
          mensaje: "Imagen de hospital actualizada",
          hospital: hospitalActualizado
        });
      });
    });
  }
}

module.exports = app;
