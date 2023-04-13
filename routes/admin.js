const express = require('express');

const router = express.Router();

const adminControllere = require('../controller/admin')

router.get('/', adminControllere.getProducts);

router.post('/', adminControllere.postProduct);

router.get('/:id', adminControllere.getProduct);

router.patch('/:id', adminControllere.updateProduct);

router.delete('/:id', adminControllere.deleteProduct);

module.exports = router;
