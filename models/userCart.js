const mongoose = require("mongoose");

const userCartSchema = new mongoose.Schema({
  // relación inversa apuntando al Usuario:
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      title: String,
      price: String,
      image: String,
      size: String,
      quantity: { type: Number, default: 1 }
    }
  ]
});

userCartSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const UserCart = mongoose.model("UserCart", userCartSchema);

module.exports = UserCart;