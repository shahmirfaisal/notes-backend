const User = require("../models/user");
const { errorHandler } = require("../utils");
const jwt = require("jsonwebtoken");

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

exports.signup = async (req, res, next) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();

  if (!name.length) {
    return errorHandler(next, "Enter your name!", 422);
  }
  if (!emailRegex.test(email)) {
    return errorHandler(next, "Invalid email!", 422);
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return errorHandler(next, "Email already exists!", 422);
  }
  if (password.length < 6 || password.length > 32) {
    return errorHandler(
      next,
      "Password's length should be between 6 and 32",
      422
    );
  }

  const user = new User({
    name,
    email,
    password,
  });
  await user.save();
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
  res.json({ user, token });
};

exports.login = async (req, res, next) => {
  let { email, password } = req.body;
  email = email.trim();

  const user = await User.findOne({ email });
  if (!user) {
    return errorHandler(next, "Wrong email!", 422);
  }

  if (user.password !== password) {
    return errorHandler(next, "Wrong password", 422);
  }

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
  res.json({ user, token });
};

exports.isLogin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  res.json({ user });
};
