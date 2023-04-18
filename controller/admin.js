const Product = require("../models/product");
const User = require('../models/user')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log("Products Fetched");
      console.log(products);
      res.status(200).json({ msg: "Products Fetched", products: products });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.session.user
  });
  product
    .save()
    .then((result) => {
      console.log("product created");
      res.status(201).json({ msg: "Product Created", product: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.find({ _id: productId })
    .then((product) => {
      if (!product) {
        res.send("Product not found with this Id:", productId);
      }
      res.status(200).json({ msg: "Product Fetched", product: product });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateProduct = (req, res, next) => {
  const productId = req.params.id;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const UpdatedDescription = req.body.description;

  Product.findByIdAndUpdate({ _id: productId })
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = UpdatedDescription;
      // console.log(product);
      return product
        .save()
        .then((updatedProduct) => {
          console.log("product updated");
          res
            .status(201)
            .json({ msg: "Product Updated", product: updatedProduct });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.findByIdAndDelete({ _id: productId })
    .then((result) => {
      // if (!product) {
      //   res.json({ msg: "Product is Not Founded" });
      // }
      res.json({ msg: "Product Deleted", status: result});
    })
    .catch((err) => {
      console.log(err);
    });
};
