const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let cartSchema = Schema({
  cartId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  products: [
    {
      productId: {
        type: String,
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
