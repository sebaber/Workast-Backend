const mongoose = require('mongoose');
const User = require('../models/user');

/*
 * GET /user route to retrieve all the users.
 */
function getUsers(req, res) {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.send(err))
}

/*
 * POST /user to save a new user.
 */
function postUser(req, res) {
    var newUser = new User(req.body);

    newUser.save()
    .then(user => res.json({message: "User successfully added!", user:user}))
    .catch(err => res.send(err))
}

/*
 * GET /user/:id route to retrieve a user given its id.
 */
function getUser(req, res) {
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.send(err))
}


module.exports = {
    getUsers: getUsers,
    getUser: getUser,
    postUser: postUser,
};