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
    //   We are decoding the token to get our payload which contains the user ID
    //   We created the payload when we were registering the user
    //   Therefore every token decoded will contain the user's id
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    console.log(decoded);

    //Decoded is out jwt token,
    // Remember when we were creating out token we passed in currentUser in the payload object,
    // That is where decoded.currentUser is coming
    req.user = decoded.currentUser;

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
