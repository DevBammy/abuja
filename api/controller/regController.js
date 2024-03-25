import Register from '../models/regModel.js';
import { errorHandler } from '../utils/errorHandler.js';
export const register = async (req, res, next) => {
  const {
    title,
    fullname,
    phone,
    assembly,
    district,
    area,
    gender,
    uid,
    avatar,
  } = req.body;

  // if (
  //   !title ||
  //   !fullname ||
  //   !phone ||
  //   !assembly ||
  //   !district ||
  //   !area ||
  //   !gender ||
  //   !avatar ||
  //   !uid
  // ) {
  //   next(
  //     errorHandler(501, 'Kindly update your profile first or fill all fields')
  //   );
  // }

  const newRegistration = new Register({
    title,
    fullname,
    phone,
    assembly,
    district,
    area,
    gender,
    uid,
    avatar,
  });

  try {
    await newRegistration.save();
    res.status(201).json('User succesfully Registered!');
  } catch (error) {
    next(error);
  }
};
