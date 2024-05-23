const Joi = require("joi");
const users = require("../models/users.models");

// Get all users
const getAll = (req, res) => {
    users.getAllUsers((err, num_rows, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(200).send(results);
    });
};

// Create a new user
const create = (req, res) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = req.body;
    users.addNewUser(user, (err, id) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(201).send({ user_id: id });
    });
};

// Delete a user
const deleteUser = (req, res) => {
    let user_id = parseInt(req.params.user_id);

    users.getSingleUser(user_id, (err, result) => {
        if (err === 404) {
            return res.sendStatus(404);
        }
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        users.deleteUser(user_id, result, (err, id) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            return res.sendStatus(200);
        });
    });
};

// User login
const login = (req, res) => {
    const schema = Joi.object({
        "email": Joi.string().required(),
        "password": Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    users.authenticateUser(req.body.email, req.body.password, (err, id) => {
        if (err) return res.status(400).send("Invalid email / password supplied");
        if (!id) return res.status(400).send("Invalid email / password supplied");
        users.getToken(id, (err, token) => {
            if (err) return res.status(500).send("An error occurred while retrieving the token");
            if (token) {
                return res.status(200).send({ user_id: id, session_token: token });
            } else {
                users.setToken(id, (err, token) => {
                    if (err) return res.sendStatus(500).send("An error occurred while setting the token");
                    return res.status(200).send({ user_id: id, session_token: token });
                });
            }
        });
    });
};

// User logout
const logout = (req, res) => {
    let token = req.get('X-Authorization');
    users.removeToken(token, (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        } else {
            return res.sendStatus(200);
        }
    });
};

module.exports = {
    getAll:getAll,
    create:create,
    deleteUser:deleteUser,
    login:login,
    logout:logout
};
