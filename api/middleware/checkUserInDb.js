const User = require("../users/users-model.js");

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
        res.status(500).json(`Server CheckUser Error: ${error}`);
    }
};

module.exports = {
    checkUserInDb
};