var express = require('express');
var router = express.Router();
var upload = require('../config/multerService');
var Authentication = require('../middleware/jwt-auth');
const userController = require('../controllers/userController')


router.get('/', Authentication.checkAuth , userController.getUserById);

router.post(
  '/register',
  upload.any('picture'),
  userController.register
);
router.post(
  '/login',
  userController.login
);

module.exports = router;
