const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: new Date() },

  // price: { type: Schema.Types.ObjectId, ref: "CountryPricing" },
});

module.exports = mongoose.model("Product", ProductSchema);
