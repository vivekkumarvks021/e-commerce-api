const Yup = require("yup");
const dbRegister = require("../../models/register");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await dbRegister.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not registered. Please register first.",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      success: false,
      message: "Password mismatched.",
    });
  }

  let token = jwt.sign(
    { id: user.email, userType: user.userType },
    "mySecretKey"
  );

  res.json({
    success: true,
    message: "login successfully.",
    token,
  });
};

module.exports = { login, loginSchema };
