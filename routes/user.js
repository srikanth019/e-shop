const express = require('express');

const router = express.Router();

const userControllere = require('../controller/user');

router.get('/', userControllere.getProducts);

router.get('/cart', userControllere.getCart);

router.post('/cart', userControllere.postCart)

router.get('/orders', userControllere.getOrders);

module.exports = router;
