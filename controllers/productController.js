const Product = require("../models/product");
const CountryPricing = require("../models/countryPricing"); // Import the CountryPricing model
const { body, validationResult } = require("express-validator");

exports.createProduct = [
  body("title", "Empty name").trim().escape(),
  body("description", "Empty description").trim().escape(),

  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return a 400 Bad Request status with validation errors
    }

    const { title, description, owner, date } = req.body;

    // Create the product
    const product = new Product({
      title,
      description,
      owner,
      date,
    });

    // Save the product
    product.save((err, savedProduct) => {
      if (err) {
        console.error("Error saving product:", err);
        return next(err); // Pass the error to the error handling middleware
      }

      const { country, currency, price } = req.body;
      const countryPricing = new CountryPricing({
        product: savedProduct._id,
        country,
        currency,
        price,
      });

      // Save the pricing information
      countryPricing.save((err) => {
        if (err) {
          console.error("Error saving pricing information:", err);
          return next(err); // Pass the error to the error handling middleware
        }
        res.status(200).json({ msg: "Product and pricing information saved" });
      });
    });
  },
];
exports.getOneProduct = async (req, res, next) => {
  try {
    const productId = req.params.product_id;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        errors: [{ message: `Product ${productId} was not found` }],
      });
    }

    // Find the country pricing information for the product and populate the 'product' field
    const countryPricing = await CountryPricing.findOne({
      product: productId,
    }).populate("product");

    if (!countryPricing) {
      return res.status(404).json({
        errors: [
          {
            message: `Country pricing information not found for product ${productId}`,
          },
        ],
      });
    }

    // Combine product and country pricing information
    const productWithCountryPricing = {
      product,
      countryPricing,
    };

    res.json(productWithCountryPricing);
  } catch (err) {
    return next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .sort([["date", "ascending"]])
      .populate("owner");

    if (!products) {
      return res
        .status(404)
        .json({ errors: [{ message: "Products not found" }] });
    }

    // Create a function to fetch country pricing data for a product
    const fetchCountryPricing = async (product) => {
      const countryPricing = await CountryPricing.find({
        product: product._id,
      });
      return { ...product.toObject(), countryPricing };
    };

    // Use Promise.all to fetch country pricing data for all products
    const productsWithCountryPricing = await Promise.all(
      products.map((product) => fetchCountryPricing(product))
    );

    res.json(productsWithCountryPricing);
  } catch (err) {
    return next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { title, description, owner, date } = req.body;

    // Update the product by product ID
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.product_id,
      {
        title,
        description,
        owner,
        date,
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ errors: [{ message: "Product not found" }] });
    }

    const { country, currency, price } = req.body;

    // Find and update the associated country pricing by product ID
    const updatedCountryPricing = await CountryPricing.findOneAndUpdate(
      { product: req.params.product_id },
      {
        country,
        currency,
        price,
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedCountryPricing) {
      return res
        .status(404)
        .json({ errors: [{ message: "Country pricing not found" }] });
    }

    res.json({
      message: `Updated product ${req.params.product_id} and country pricing successfully!`,
      updatedProduct,
      updatedCountryPricing,
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.product_id);

    if (!product) {
      return res
        .status(404)
        .json({ errors: [{ message: "product not found" }] });
    }

    res.json({
      message: `product ${req.params.product_id} was successfully deleted.`,
    });
  } catch (err) {
    return next(err);
    res.status(500).send("Server error");
  }
};
