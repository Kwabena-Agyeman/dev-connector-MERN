const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  // Get token from the header

  const token = req.header("x-auth-token");

  // Check if no token is avaliable

  if (!token) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  // Verify Token

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
