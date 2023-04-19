// {
//   "title": "product 17",
//   "imageUrl": "https://as1.ftcdn.net/jpg/02/70/35/00/220_F_270350073_WO6yQAdptEnAhYKM5GuA9035wbRnVJSr.jpg",
//   "price": 258,
//   "description": "This is a nice product"
// }

// const id = req.user._id;
// console.log('user', user);
// req.user
//   .populate(new ObjectId('64391b13058c604aeab4b08b'))
//   // .execPopulate()
//   .then((user) => {
//     console.log(user)
//     const products = user.cart.items;
//     console.log(products);
//     res.json({msg: "Cart Items", cartProducts: products});
//   })
//.catch((err) => console.log(err));
// req.user.populate('cart.items').then((user) => {
//   const products = user.cart.items
//   .map(i => {
//     return { product: {...i.productId._doc}, quantity: i.quantity}
//   });
//   console.log(products);
// }).catch(err => {
//   console.log(err);
// })

req.user
  .populate("cart.items.productId")
  // .execPopulate()
  .then((user) => {
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products: products,
      quantity: quantity,
      totalAmount: totalAmount,
    });
    return order.save();
  })
  // .then(result => {
  //   return req.user.clearCart();
  // })
  .then(() => {
    res.json({ msg: "Order Created" });
  })
  .catch((err) => console.log(err));

// exports.postOrder = (req, res, next) => {
//   User.find({ _id: req.user._id } )
//     .populate({
//       path: "cart.items.productId",
//       select: "title price description imageUrl userId",
//     })
//     .then((cartItems) => {
//       // console.log(cartItems)
//       let finalAmount=0;
//       let finalQuantity=0;
//       let FinalProducts=[];
//       const products = cartItems[0].cart.items.map((i) => {

//         return {product: i.productId, quantity:i.quantity,totalAmount: i.productId.price*i.quantity}
//       });
//       const total=products.map(i=>{
//            finalAmount=finalAmount+i.totalAmount
//            finalQuantity=finalQuantity+i.quantity

//       })
//       console.log(finalAmount);
//       const order = new Order({
//         user: {
//           name: req.user.name,
//           userId: req.user,
//         },
//         products: products,
//         quantity: finalQuantity,
//         totalAmount: finalAmount
//       });
//       return order.save();
//     })
//     .then(order => {
//       res.send({msg: "Order created"});
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

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
        return res.json({ msg: "Cart is Empty" });
      } else {
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
