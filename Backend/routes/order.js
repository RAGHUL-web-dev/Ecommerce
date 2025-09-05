const express = require('express');
const { newOrder, getSingleOrder, myOrder, orders, updateOrder, deleteOrder } = require('../controller/orderController');
const { isAutenicatedUser, authorizenRoles } = require("../middleware/authenicate")
const router = express.Router();

router.route('/order/new').post(isAutenicatedUser, newOrder)
router.route('/order/:id').get(isAutenicatedUser, getSingleOrder)
router.route('/myorders').get(isAutenicatedUser, myOrder)


// Admin routes
router.route('/admin/orders').get(isAutenicatedUser, authorizenRoles('admin' || 'ADMIN'), orders)
router.route('/admin/order/:id').put(isAutenicatedUser, authorizenRoles('admin' || 'ADMIN'), updateOrder)
                                .delete(isAutenicatedUser, authorizenRoles('admin' || 'ADMIN'), deleteOrder)


module.exports = router