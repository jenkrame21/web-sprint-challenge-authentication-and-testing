const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/",  (req, res) => {
    Users.findUsers()
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            res.send(error);
        });
});

module.exports = router;