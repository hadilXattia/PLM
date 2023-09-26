const mongoose = require("mongoose");

const countryPricingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // Other pricing-related fields
});

const CountryPricing = mongoose.model("CountryPricing", countryPricingSchema);

module.exports = CountryPricing;
