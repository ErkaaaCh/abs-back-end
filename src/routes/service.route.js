const express = require('express');
const router = express.Router();
const serviceController = require("../controllers/service.controller");

router.post('/create' , serviceController.create);
router.post('/all' , serviceController.all);
router.post('/update' , serviceController.update);

module.exports = router