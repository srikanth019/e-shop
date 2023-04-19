const express = require("express");

const router = express.Router();

const userControllere = require("../controller/user");

router.get("/", userControllere.getProducts);

router.get("/cart", userControllere.cartProducts);

router.post("/cart/:id", userControllere.postCart);

router.delete("/cart/:id", userControllere.deleteProductFromCart);

router.get("/order", userControllere.getOrders);

router.post("/order", userControllere.postOrder);

router.get("/:id", userControllere.getProduct);

module.exports = router;
