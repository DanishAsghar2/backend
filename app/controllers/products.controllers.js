const Joi = require("joi");
const products = require("../models/products.models");
const { get } = require("express/lib/response");

// Get all products
const getAll = (req, res) => {
    products.getAllProducts((err, num_rows, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(200).send(results);
    });
};

const getOne = (req, res) => {

    let fragrance_id = parseInt(req.params.fragrance_id);

    products.getSingleProduct(fragrance_id, (err, result) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);
        return res.status(200).send(result);
    });
};

const getByCustom = (req, res) => {

    let custom = parseInt(req.params.custom);


    products.getByCustom(custom, (err, num_rows, results) => {
        if (err) return res.sendStatus(500);
        
        return res.status(200).send(results);
    });
};

// Create a new product
const create = (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        type: Joi.string().required(),
        description: Joi.string().required(),
        base: Joi.string().required(),
        heart: Joi.string().required(),
        top: Joi.string().required(),
        custom: Joi.string().required()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let product = req.body;
    products.addNewProduct(product, (err, id) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(201).send({ fragrance_id: id });
    });
};

// Delete a product
const deleteProduct = (req, res) => {
    let fragrance_id = parseInt(req.params.fragrance_id);

    products.getSingleProduct(fragrance_id, (err, result) => {
        if (err === 404) {
            return res.sendStatus(404);
        }
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        products.deleteProduct(fragrance_id, (err) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            return res.sendStatus(200);
        });
    });
};


module.exports = {
    getAll: getAll,
    create: create,
    deleteProduct: deleteProduct,
    getOne: getOne,
    getByCustom: getByCustom
};
