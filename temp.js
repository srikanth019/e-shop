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

// app.use(express.urlencoded({ extended: true }));

// text = `<h1>You are Successfully Changed Your Password.</h1>
//     <p>Your New Password is: "${newPassword}" </p>
//     <p>Thank You</p>
//   `;
//       sendEmail(result.email, "Password Changed", text);
//       res.json({ msg: "Your Password Is Successfullt Changed" });

const express = require("express");
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.listen(3001, () => {
  console.log("server started");
});
