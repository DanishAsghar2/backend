const Joi = require("joi");
const cart = require("../models/cart.model");

// Get all items in the cart
const getAllCart = (req, res) => {
    cart.getAllCart((err, num_rows, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(200).send(results);
    });
};

const getByUserID = (req, res) => {
    let user_id = req.params.user_id;

    cart.getCartByUserID(user_id, (err, results) => {
        if(err) return res.sendStatus(500);
        return res.status(200).send(results);
    });
};

// Add an item to the cart
const addToCart = (req, res) => {
    const schema = Joi.object({
        fragrance_id: Joi.number().required(),
        price: Joi.number().required(),
        user_id: Joi.number().required(),
        quantity: Joi.number().required()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let cartItem = req.body;
    cart.addItemToCart(cartItem, (err, id) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(201).send({ cart_id: id });
    });
};

// Remove an item from the cart
const removeFromCart = (req, res) => {
    let cart_id = parseInt(req.params.cart_id);

    cart.removeItemFromCart(cart_id, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.sendStatus(200);
    });
};

module.exports = {
    getAllCart: getAllCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    getByUserID: getByUserID
};
