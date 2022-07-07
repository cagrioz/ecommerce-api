const express = require('express');
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);

router.get(['/signin', '/login'], viewsController.getLogin);
router.get(['/signup', '/register'], viewsController.getSignup);

router.get('/cart', authController.protectRoute, viewsController.getCart);

router.get('/categories/:id', viewsController.getCategory);

router.get('/categories/parent/:id', viewsController.getParentCategory);

router.get('/products/:id', viewsController.getProduct);

module.exports = router;
