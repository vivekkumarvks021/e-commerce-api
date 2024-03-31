const jwt = require("jsonwebtoken");

const onlyAdmin = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.json({
        success: false,
        message: "token not found.",
      });
    }

    const decoded = jwt.verify(token, "mySecretKey");

    if (decoded.userType === "admin") return next();

    return res.json({
      success: false,
      message: "You are not allowed.",
    });
  } catch (error) {
    return res.json({ success: false, message: "Un-Authorised Token" });
  }
};

module.exports = onlyAdmin;
