const Joi = require("joi");
const order = require("../models/orders.model");

// Get all items in the order
const getAll = (req, res) => {
    order.getAll((err, num_rows, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(200).send(results);
    });
};

const getByUserID = (req, res) => {
    let user_id = req.params.user_id;

    order.getOrderByUserID(user_id, (err, results) => {
        if(err) return res.sendStatus(500);
        return res.status(200).send(results);
    });
};

const getByOrderNumber = (req, res) => {
    let order_num = req.params.order_num;

    order.getOrderByOrderNumber(order_num, (err, results) => {
        if(err) return res.sendStatus(500);
        return res.status(200).send(results);
    });
};

// Add an item to the order
const create = (req, res) => {
    const schema = Joi.object({
        fragrance_id: Joi.number().required(),
        delivery_id: Joi.number().required(),
        billing_id: Joi.number().required(),
        user_id: Joi.number().required(),
        order_num: Joi.number().required()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let orderItem = req.body;
    order.create(orderItem, (err, id) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(201).send({ order_id: id });
    });
};

// Remove an item from the order
const removeOrder = (req, res) => {
    let order_id = parseInt(req.params.order_id);

    order.removeOrder(order_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.sendStatus(200);
    });
};

module.exports = {
    getAll: getAll,
    create: create,
    removeOrder: removeOrder,
    getByUserID: getByUserID,
    getByOrderNumber: getByOrderNumber
};
