const Yup = require("yup");
const bcrypt = require("bcrypt");
const dbRegister = require("../../models/register");

const registerSchema = Yup.object().shape({
  name: Yup.string().min(3).required(),
  email: Yup.string().email().required(),
  mobile: Yup.string().required(),
  password: Yup.string().required(),
});

const register = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  let checkUser = await dbRegister.findOne({ email });

  if (checkUser) {
    return res.json({
      success: false,
      message: "User already registered.",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let userId = (await dbRegister.count()) + 1;
  userId = `USER${userId}`;

  await new dbRegister({
    userId,
    name,
    email,
    mobile,
    password: hashedPassword,
    userType: "user",
  }).save();

  res.json({
    success: true,
    message: "Registered successfully.",
  });
};

module.exports = { register, registerSchema };
