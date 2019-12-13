var jwt = require("jsonwebtoken"); // token
var SEED = require("../config/config").SEED;

/* ===================================== */
/* Validar token - Cualquier que pase desde acá, necesitará el token*/
/* ===================================== */
exports.verificaToken = function(req, res, next) {
  // Recibiendo el token
  let token = req.query.token;
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      // 401 => sin autorización
      return res.status(401).json({
        ok: false,
        mensaje: "Token incorrecto",
        errors: err
      });
    }

    req.usuario = decoded.usuario; // Esto para tener la info del usuario en todos lados

    // Si no hay error, continuar con las siguentes rutas
    next();
  });
};
