const express = require('express');

const router = express.Router();

const authControllere = require('../controller/authentication');

// router.post('/signup', authControllere.postSignUp);

router.post('/login', authControllere.postLogin);

router.post('/logout', authControllere.postLogout);

module.exports = router;
