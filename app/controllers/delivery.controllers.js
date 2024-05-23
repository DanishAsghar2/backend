const Joi = require("joi");
const delivery = require("../models/delivery.model");

// Get all items in the delivery
const getAllDelivery = (req, res) => {
    delivery.getAllDelivery((err, num_rows, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(200).send(results);
    });
};

const getByUserID = (req, res) => {
    let user_id = req.params.user_id;

    delivery.getDeliveryByUserID(user_id, (err, results) => {
        if(err) return res.sendStatus(500);
        return res.status(200).send(results);
    });
};

// Add an item to the delivery
const addDelivery = (req, res) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        addline1: Joi.string().required(),
        addline2: Joi.string().required(),
        townorcity: Joi.string().required(),
        postcode: Joi.string().required(),
        phone: Joi.string().required(),
        country: Joi.string().required(),
        user_id: Joi.number().required(),
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let deliveryItem = req.body;
    delivery.addDelivery(deliveryItem, (err, id) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(201).send({ delivery_id: id });
    });
};

// Remove an item from the delivery
const removeDelivery = (req, res) => {
    let delivery_id = parseInt(req.params.delivery_id);

    delivery.removeDelivery(delivery_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.sendStatus(200);
    });
};

module.exports = {
    getAllDelivery: getAllDelivery,
    addDelivery: addDelivery,
    removeDelivery: removeDelivery,
    getByUserID: getByUserID
};
