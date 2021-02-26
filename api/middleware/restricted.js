const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/secrets.js");

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if(!token) {
    res.status(401).json("Token required.");
  } else {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if(err) {
        res.status(401).json("Token invalid. " + err.message);
      } else {
        req.decoded = decoded
        next();
      }
    })
  }
};