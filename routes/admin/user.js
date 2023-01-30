var express = require('express');
var router = express.Router();
var upload = require("../../config/multerService");
const userController = require('../../controllers/admin/userController');


router.get('/:id', userController.getUserById);

router.get('/all', userController.getAllUsers);


module.exports = router;
