const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const mongoose = require("mongoose");
const order = require("../models/order");
const ObjectId = mongoose.Types.ObjectId;

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

exports.getProduct = (req, res, next) => {
  // console.log(req.user);
  const productId = req.params.id;
  // Product.find({ _id: productId })
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        res.send("Product not found with this Id:", productId);
      }
      console.log("Fetched single product");
      res.status(200).json({ msg: "Product Fetched", product: product });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.cartProducts = (req, res) => {
  User.find({ _id: req.user._id })
    .populate({
      path: "cart.items.productId",
      select: "title price description imageUrl userId",
    })
    .then((cartItems) => {
      // console.log(cartItems);
      const products = cartItems[0].cart.items.map((i) => {
        return { product: i.productId, quantity: i.quantity };
      });

      console.log(products);
      res.json({ msg: "Cart Products", products: products });
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getCart = (req, res, next) => {
//   res.json({msg: "Cart Products"});
// }

exports.postCart = (req, res, next) => {
  const prodId = req.params.id;
  // Product.findById({ _id: prodId })
  Product.findById(prodId)
    .then((product) => {
      // console.log(product);
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.send({ msg: "Product added to cart", status: result });
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
      res.json({ msg: "Product deleted From Cart", result: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  let createdOrder;
  User.find({ _id: req.user._id })
    .populate({
      path: "cart.items.productId",
      select: "title price description imageUrl userId",
    })
    .then((cartItems) => {
      console.log(cartItems);
      if (cartItems[0].cart.items.length <= 0) {
        
        return res.json({ msg: "Cart is Empty"});
        
      }
      else{
        let finalAmount = 0;
        let finalQuantity = 0;
        let FinalProducts = [];
        const products = cartItems[0].cart.items.map((i) => {
          return {
            product: i.productId,
            quantity: i.quantity,
            totalAmount: i.productId.price * i.quantity,
          };
        });
        // console.log(products)
        const total = products.map((i) => {
          FinalProducts.push(i.product);
          finalAmount = finalAmount + i.totalAmount;
          finalQuantity = finalQuantity + i.quantity;
          return {
            FinalProducts: FinalProducts,
            finalAmount: finalAmount,
            finalQuantity: finalQuantity,
          };
        });
        // console.log(FinalProducts);
        const order = new Order({
          user: {
            name: req.user.name,
            userId: req.user._id,
          },
          orderData: [
            {
              product: FinalProducts,
              quantity: finalQuantity,
              totalAmount: finalAmount,
            },
          ],
        });
        return order.save();
      }
    })
    .then((order) => {
      createdOrder = order;
      return req.user.clearCart();
    })
    .then(() => {
      console.log("Order created");
      res.json({ msg: "Order created", order: createdOrder });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log("Orders Fetched");
      res.json({ msg: "Orderd Items", orders: orders });
    })
    .catch((err) => {
      console.log(err);
    });
};
