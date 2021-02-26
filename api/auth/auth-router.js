const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require('express').Router();

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");
const { jwtSecret } = require("../../config/secrets.js");
const { checkPayload } = require("../middleware/checkPayload.js");
const { checkUserInDb } = require("../middleware/checkUserInDb.js");

router.post('/register', checkPayload, checkUserInDb, async (req, res) => {
  try {
    const credentials = req.body;
    const rounds = process.env.BYCRYPT_ROUNDS || 10;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    const newUser = await Users.addUser({
      username: credentials.username,
      password: hash
    })
    res.status(201).json(newUser);
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
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeToken(user);

          res.status(200).json({
            message: `Welcome, ${username}`,
            token
          });
        } else {
          res.status(401).json({
            message: "Invalid credentials."
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message
        });
      });
  } else {
    res.status(400).json({
      message: "Username and password required."
    })
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
