
const checkPayload = (req, res, next) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.status(401).json("Username and password are required.");
    } else {
        next();
    }
}

module.exports = {
    checkPayload
};