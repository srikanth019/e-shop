const product = require("../models/product");
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
  res.send("Cart Items");
};

exports.postCart = (req, res, next) => {
  const prodId = req.params.id;
//   console.log(prodId);
  Product.findById({_id: prodId})
    .then((product) => {
        console.log(product);
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.send("Product added to cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  res.send("Orderd Items");
};
