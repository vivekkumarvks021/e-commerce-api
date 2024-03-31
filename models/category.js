const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let categorieSchma = Schema({
  categories: [
    {
      categoryId: {
        type: String,
        required: true,
      },

      categoryName: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Categorie", categorieSchma);
