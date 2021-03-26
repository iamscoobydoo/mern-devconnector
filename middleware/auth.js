const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    //get token from header
    const token = req.header("x-auth-token");

    //if no token
    if (!token) {
        return res.status(401).json({ msg: "No token! Authorisation denied" });
    }

    //verify token
    try {
        const decoded = jwt.verify(token, config.get("jwtKey"));
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: "Invalid Token" });
    }
};
