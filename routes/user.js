const express = require("express");

const router = express.Router();

const userControllere = require("../controller/user");

const isAuth = require("../middleware/is-Auth");

router.get("/", userControllere.getProducts);

router.get("/cart",isAuth, userControllere.cartProducts);

router.post("/cart/:id",isAuth,userControllere.postCart);

router.delete("/cart/:id",isAuth, userControllere.deleteProductFromCart);

router.get("/order", isAuth, userControllere.getOrders);

router.post("/order", isAuth, userControllere.postOrder);

router.get("/:id", userControllere.getProduct);

module.exports = router;
