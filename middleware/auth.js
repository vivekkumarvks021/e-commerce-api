const jwt = require("jsonwebtoken");
const dbRegister = require("../models/register");

const checkToken = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.json({
        success: false,
        message: "token not found.",
      });
    }

    const decoded = jwt.verify(token, "mySecretKey");

    const user = dbRegister.find({ email: decoded.id });
    if (user) {
      next();
    }
  } catch (error) {
    res.json({ success: false, message: "Un-Authorised Token" });
  }
};

module.exports = checkToken;
