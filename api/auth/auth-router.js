const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const { isValid } = require("../users/users-service.js");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/secrets.js");

const Users = require("../users/users-model.js");
const mw = require("../middleware/middleware.js");

router.post('/register', mw.checkPayload, mw.checkUserInDb, (req, res) => {
  try {
    const credentials = req.body;
    const rounds = process.env.BYCRYPT_ROUNDS || 10;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;
  
    Users.addUser(credentials)
      .then((user) => {
        res.status(201).json(user);
      });
  } catch(error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        // compare the password the hash stored in the database
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeToken(user);

          res.status(200).json({ 
            message: "Welcome" + user.username,
            token
          });
        } else {
          res.status(401).json({
            message: "Invalid credentials"
          });
        }
      })
      .catch(error => {
        res.status(500).json({ 
          message: error.message
        });
      });
  } else {
    res.status(400).json({
      message: "Username and password required.",
    });
  }
});

function makeToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '500s'
  }

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
