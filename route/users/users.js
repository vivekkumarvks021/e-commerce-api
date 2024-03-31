const dbRegister = require("../../models/register");
const Yup = require("yup");
const bcrypt = require("bcrypt");

const users = async (req, res) => {
  const users = await dbRegister.find(
    { userType: "user" },
    { password: 0, _id: 0 }
  );
  res.json({
    success: true,
    users,
  });
};

const singleUser = async (req, res) => {
  const { userId } = req.param;
  const user = await dbRegister.find({ userId }, { password: 0, _id: 0 });
  res.json({
    success: true,
    user,
  });
};

const userSchema = Yup.object().shape({
  name: Yup.string().min(3).required(),
  email: Yup.string().email().required(),
  mobile: Yup.string().required(),
  password: Yup.string().required(),
});

const addUserByAdmin = async (req, res) => {
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
  userId = `USER${new Date().now()}`;

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
    message: "User Added successfully.",
  });
};

const updateUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  const { userId } = req.params;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const updatedUser = await dbRegister.findOneAndUpdate(
    { userId },
    { name, email, mobile, password: hashedPassword }
  );

  if (updatedUser) {
    res.json({
      success: true,
      message: "User details updated.",
    });
  } else {
    res.json({
      success: false,
      message: "User Not found.",
    });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const deleteUser = await dbRegister.deleteOne({ userId });

  if (deleteUser.deletedCount) {
    res.json({
      success: true,
      message: "User Deleted.",
    });
  } else {
    res.json({
      success: false,
      message: "User Not found.",
    });
  }
};

module.exports = {
  users,
  singleUser,
  addUserByAdmin,
  userSchema,
  updateUser,
  deleteUser,
};
