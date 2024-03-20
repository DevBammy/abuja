import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/errorHandler.js';

// Create a user account
export const signup = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ fullname, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json('User created successfully');
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email address is already in use' });
    }
    next(error);
  }
};

// Sign user in
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(401, 'Invalid credentials'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Invalid credentials'));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({ rest });
  } catch (error) {
    next(error);
  }
};

// Google singin
// export const google = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (user) {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//       const { password: pass, ...rest } = user._doc;
//       res
//         .cookie('token', token, {
//           httpOnly: true,
//           expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//         })
//         .status(200)
//         .json(rest);
//     } else {
//       const generatedPassword = Math.random().toString(36).slice(-8);
//       const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
//       const newUser = new User({
//         fullname: req.body.fullname,
//         email: req.body.email,
//         password: hashedPassword,
//         avatar: req.body.avatar,
//       });
//       newUser.save();
//       const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
//       const { password: pass, ...userInfo } = user._doc;
//       res
//         .cookie('token', token, {
//           httpOnly: true,
//           expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//         })
//         .status(200)
//         .json(userInfo);
//     }
//   } catch (error) {
//     next(error);
//   }
// };
