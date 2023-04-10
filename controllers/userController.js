const asyncHandler = require('express-async-handler');
const Users = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//@desc register a new user
//@route POST /api/users
//@access public
const addUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await Users.create({
    username,
    password: hashedPassword,
    email,
  });
  if (newUser) res.status(200).json({ _id: newUser._id, username, email });
  res.status(400);
  throw new Error('Data is not valid');
});

//@desc login user
//@route POST /api/users
//@access public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '15m',
      }
    );
    res.status(200).json({ accessToken });
  }
  res.status(401);
  throw new Error('email or password is not valid');
});

//@desc get user info
//@route GET /api/users
//@access private
const currentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
});

module.exports = {
  addUser,
  login,
  currentUser,
};
