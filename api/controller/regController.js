import Register from '../models/regModel.js';

export const register = async (req, res, next) => {
  const {
    title,
    fullname,
    email,
    phone,
    assembly,
    district,
    area,
    gender,
    ageGroup,
    unit,
    educationalLevel,
    maritalStatus,
    avatar,
  } = req.body;

  const newRegistration = new Register({
    title,
    fullname,
    email,
    phone,
    assembly,
    district,
    area,
    gender,
    ageGroup,
    unit,
    educationalLevel,
    maritalStatus,
    avatar,
  });

  try {
    await newRegistration.save();
    res.status(201).json('User succesfully Registered!');
  } catch (error) {
    next(error);
  }
};
