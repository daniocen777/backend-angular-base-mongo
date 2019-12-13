/* Ruta para login */
var express = require("express");
var bcrypt = require("bcryptjs"); // encriptar contraseña
var jwt = require("jsonwebtoken"); // token
var SEED = require("../config/config").SEED;

// Inicializar variables
var app = express();
var Usuario = require("../models/usuario");

/* ===================================== */
/* Obtener todos los usuarios */
/* ===================================== */
app.post("/", (req, res) => {
  // Recibir correo y pass
  let body = req.body;
  // ¿Existe usuario?
  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas - email",
        errors: err
      });
    }

    // Verificando contraseña
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas - password",
        errors: err
      });
    }

    // Crear token
    /* jwt.sign(token, semilla secreta para enciptar, fecha de expiración) 14400 => 4 horas */
    usuarioDB.password = ":("; //uitando el password
    let token = jwt.sign({ usuario: usuarioDB }, SEED, {
      expiresIn: 14400
    });

    res.status(200).json({
      ok: true,
      usuario: usuarioDB,
      token: token,
      id: usuarioDB._id
    });
  });
});

module.exports = app;
