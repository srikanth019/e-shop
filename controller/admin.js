const {
  PRODUCT_NOT_FOUND,
  AUTHORISION_MSG,
  ADMIN_PRODUCTS,
  PRODUCT_CREATED,
  PRODUCTS,
  UPDATE,
  DELETED,
} = require("../constants/msg");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find({ userI: req.user._id })
    .then((products) => {
      console.log("Products Fetched");
      res.status(200).json({ msg: ADMIN_PRODUCTS, products: products });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("product created");
      res.status(201).json({ msg: PRODUCT_CREATED, product: result });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.findOne({ _id: productId })
    .then((product) => {
      if (!product) {
        throw new Error(PRODUCT_NOT_FOUND);
      }
      res.status(200).json({ msg: PRODUCTS, product: product });
    })
    .catch((err) => {
      return next(err);
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
      if (product.userId.toString() !== req.user._id.toString()) {
        const error = new Error(AUTHORISION_MSG);
        error.httpStatusCode = 403;
        throw error;
      }
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = UpdatedDescription;
      return product
        .save()
        .then((updatedProduct) => {
          console.log("product updated");
          res.status(201).json({ msg: UPDATE, product: updatedProduct });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
     return next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.find({ _id: productId })
    .then((product) => {
      if (product.userId !== req.user._id.toString()) {
        const error = new Error(AUTHORISION_MSG);
        error.httpStatusCode = 403;
        throw error;
      }
      Product.deleteOne({ _id: productId, userId: req.user._id })
        .then((result) => {
          res.json({ msg: DELETED, status: result });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
     return next(err);
    });
};
