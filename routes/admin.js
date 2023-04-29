const express = require("express");

const router = express.Router();

const adminControllere = require("../controller/admin");

const isAuth = require("../middleware/is-Auth");

router.get("/", isAuth, adminControllere.getProducts);

router.post("/", isAuth, adminControllere.postProduct);

router.get("/:id", adminControllere.getProduct);

router.patch("/:id", isAuth, adminControllere.updateProduct);

router.delete("/:id", isAuth, adminControllere.deleteProduct);

module.exports = router;
