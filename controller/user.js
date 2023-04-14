const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log("Products Fetched");
      res.status(200).json({ msg: "Products Fetched", products: products });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
    res.send("Cart Items")
}

exports.postCart = (req, res, next) => {
    res.send("Product added to cart")
}

exports.getOrders = (req, res, next) => {
    res.send("Orderd Items")
}