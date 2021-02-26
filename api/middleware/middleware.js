const User = require("../users/users-model.js");

const checkPayload = (req, res, next) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.status(401).json("Username and password are required.");
    } else {
        next();
    }
};

const checkUserInDb = async (req, res, next) => {
    try {
        const userRows = await User.findBy({
            username: req.body.username
        });
        if(!userRows.length) {
            next();
        } else {
            res.status(401).json("Username taken.");
        }
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const checkUserExists = async (req, res, next) => {
    try {
        const userRows = await User.findBy({
            username: req.body.username
        });
        if (userRows.length) {
            req.userData = userRows[0];
            next();
        } else {
            res.status(401).json("Invalid Credentials.");
        }
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    checkPayload,
    checkUserInDb,
    checkUserExists
};