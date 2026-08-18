const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  passwordHash: String,
  verified: {
    type: Boolean,
    default: false
  },
  // campo para controlar si es usuario normal o administrador
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // tu referencia actual al modelo del carrito
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCart"
  }
});

// Limpieza del JSON para no exponer el passwordHash ni el _id de Mongo
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;