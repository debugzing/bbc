var express = require('express');
var router = express.Router();
var ctrlItems = require('../controllers/items');
var ctrlCart = require('../controllers/cart');
var ctrlSales = require('../controllers/sales');
var ctrlAdmin = require('../controllers/admin');

// items
router.get('/getitems', ctrlItems.getitems);
router.get('/deleteall', ctrlItems.deleteall);

// cart
router.get('/getcart', ctrlCart.getcart);
router.put('/addtocart', ctrlCart.addtocart);
router.delete('/removefromcart/:id', ctrlCart.removefromcart);
router.get('/clearcart', ctrlCart.clearcart);
router.get('/pay', ctrlCart.pay);

// Sales
router.get('/sales', ctrlSales.get);

// Admin
router.get('/admin/clearcarts', ctrlAdmin.clearcarts);
router.get('/admin/restock', ctrlAdmin.restock);
router.get('/admin/restock/:count', ctrlAdmin.restock);
module.exports = router;
