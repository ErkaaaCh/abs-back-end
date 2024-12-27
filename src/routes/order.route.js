const express = require('express');
const router = express.Router();
const orderController  = require("../controllers/order.controller");

router.post('/create' , orderController.create);
router.post('/all' , orderController.all);
router.post('/update' , orderController.update);
router.post('/getByCustomer' , orderController.getByCustomer);

module.exports = router;