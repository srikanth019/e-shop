const User = require("../models/user");
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
  // req.user
  //   .populate("cart.items.productId")
  //   .execPopulate()
  //   .then((user) => {
  //     const products = user.cart.items;
  //     console.log(products);
  //   })
  //   .catch((err) => console.log(err));
  req.user.populate('cart.items').then((user) => {
    const products = user.cart.items
    // .map(i => {
    //   return { product: {...i.productId._doc}, quantity: i.quantity}
    // });
    console.log(products);
  }).catch(err => {
    console.log(err);
  })
};

exports.postCart = (req, res, next) => {
  const prodId = req.params.id;
  //   console.log(prodId);
  Product.findById({ _id: prodId })
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

exports.deleteProductFromCart = (req, res, next) => {
  const prodId = req.params.id;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      console.log(result);
      res.json({ msg: "Product deleted From Cart" , result: result});
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  res.send("Orderd Items");
};

exports.postOrder = (req, res, next) => {
  res.send("Orderd Created");
};
