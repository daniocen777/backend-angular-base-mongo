var mongoose = require("mongoose"); // mongoose
var uniqueValidator = require("mongoose-unique-validator");

var rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol permitido"
};

// Para definir esquemas
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
  nombre: { type: String, required: [true, "El nombre es necesario"] },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"]
  },
  password: { type: String, required: [true, "La contraseña es necesaria"] },
  img: { type: String, required: false },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: rolesValidos
  }
});

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });

// Utilizar el schema fuera del archivo
module.exports = mongoose.model("Usuario", usuarioSchema);
