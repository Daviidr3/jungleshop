const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders);

// POST create an order
router.post('/', orderController.createOrder);

// PUT update an order
router.put('/:id', orderController.updateOrder);

// DELETE an order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
