import User from '../models/userModel.js';
import { errorHandler } from '../utils/errorHandler.js';
import bcryptjs from 'bcryptjs';

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'you are not aunthenticated'));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          avatar: req.body.avatar,
          title: req.body.title,
          fullname: req.body.fullname,
          email: req.body.email,
          phone: req.body.phone,
          assembly: req.body.assembly,
          district: req.body.district,
          area: req.body.area,
          ageGroup: req.body.ageGroup,
          gender: req.body.gender,
          unit: req.body.unit,
          educationalLevel: req.body.educationalLevel,
          maritalStatus: req.body.maritalStatus,
        },
      },
      { new: true }
    );

    const { password, ...others } = updatedUser._doc;
    return res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};
