const orderModel = require('../models/orderModel');

exports.getAllOrders = (req, res) => {
    const orders = orderModel.getAll();
    res.json(orders);
};

exports.createOrder = (req, res) => {
    const newOrder = req.body;
    const result = orderModel.create(newOrder);
    res.status(201).json(result);
};

exports.updateOrder = (req, res) => {
    const { id } = req.params;
    const updatedOrder = req.body;
    const result = orderModel.update(id, updatedOrder);
    res.json(result);
};

exports.deleteOrder = (req, res) => {
    const { id } = req.params;
    const result = orderModel.delete(id);
    res.json(result);
};
