/* Ruta Principal */
var express = require("express");
var bcrypt = require("bcryptjs"); // encriptar contraseña

// Inicializar variables
var app = express();
var Usuario = require("../models/usuario");

/* ===================================== */
/* Obtener todos los usuarios */
/* ===================================== */
app.get("/", (req, res, next) => {
  Usuario.find({}, "nombre email img role").exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando usuarios",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      usuarios: usuarios
    });
  });
});

/* ===================================== */
/* Crear nuevo usuario */
/* ===================================== */
app.post("/", (req, res) => {
  let body = req.body;
  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  // Guardar
  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear usuario",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado
    });
  });
});

/* ===================================== */
/* Actualizar usuario */
/* ===================================== */
app.put("/:id", (req, res) => {
  let id = req.params.id;
  let body = req.body;
  // Si esxiste un usuario con el id enviado
  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id " + id + " no existe",
        errors: { message: "No existe un usuario con ese ID" }
      });
    }

    // Se encontró al usuario
    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    // Editando
    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar usuario",
          errors: err
        });
      }

      usuarioGuardado.password = ":(";

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });
});

module.exports = app;