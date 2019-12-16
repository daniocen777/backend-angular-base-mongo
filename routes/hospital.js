/* Ruta para el hospital */
var express = require("express");
var mdAutenticacion = require("../middlewares/autenticacion");

// Inicializar variables
var app = express();
var Hospital = require("../models/hospital");

/* ===================================== */
/* Obtener todos los hospitales */
/* ===================================== */
app.get("/", (req, res, next) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando hospitales",
          errors: err
        });
      }

      Hospital.countDocuments({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          hospitales: hospitales,
          total: conteo
        });
      });
    });
});

/* ===================================== */
/* Crear nuevo hospital */
/* ===================================== */
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  let body = req.body;
  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  // Guardar
  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear hospital",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    });
  });
});

/* ===================================== */
/* Actualizar hospital */
/* ===================================== */
app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  // Si esxiste un usuario con el id enviado
  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar hospital",
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id " + id + " no existe",
        errors: { message: "No existe un hospital con ese ID" }
      });
    }

    // Se encontró al hospital
    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    // Editando
    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar hospital",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });
    });
  });
});

/* ===================================== */
/* Eliminar hospital */
/* ===================================== */
app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
  let id = req.params.id;
  Hospital.findOneAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar hospital",
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe hospital con ID " + id,
        errors: { message: "No existe un hospital con ese ID" }
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });
  });
});

module.exports = app;
