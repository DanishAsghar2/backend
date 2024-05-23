const Joi = require("joi");
const billing = require("../models/billing.model");

// Get all items in the billing
const getAllBilling = (req, res) => {
    billing.getAllBilling((err, num_rows, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(200).send(results);
    });
};

const getByUserID = (req, res) => {
    let user_id = req.params.user_id;

    billing.getBillingByUserID(user_id, (err, results) => {
        if(err) return res.sendStatus(500);
        return res.status(200).send(results);
    });
};

// Add an item to the billing
const addBilling = (req, res) => {
    const schema = Joi.object({
        card_number: Joi.string().required(),
        expiry_date: Joi.string().required(),
        cvv: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        addline1: Joi.string().required(),
        addline2: Joi.string().required(),
        townorcity: Joi.string().required(),
        postcode: Joi.string().required(),
        phone: Joi.string().required(),
        country: Joi.string().required(),
        user_id: Joi.number().required()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let billingItem = req.body;
    billing.addBilling(billingItem, (err, id) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(201).send({ billing_id: id });
    });
};

// Remove an item from the billing
const removeBilling = (req, res) => {
    let billing_id = parseInt(req.params.billing_id);

    billing.removeBilling(billing_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.sendStatus(200);
    });
};

module.exports = {
    getAllBilling: getAllBilling,
    addBilling: addBilling,
    removeBilling: removeBilling,
    getByUserID: getByUserID
};
