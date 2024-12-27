const express = require('express');
const router = express.Router();
const customerController  = require("../controllers/customer.controller");

router.post('/create' , customerController.create);
router.post('/login' , customerController.login);
router.post('/all' , customerController.all);

module.exports = router


