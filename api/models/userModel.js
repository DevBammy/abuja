import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    title: {
      type: String,
    },
    phone: {
      type: String,
    },
    assembly: {
      type: String,
    },
    district: {
      type: String,
    },
    area: {
      type: String,
    },
    ageGroup: {
      type: String,
    },
    unit: {
      type: String,
    },
    educationalLevel: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
    avatar: {
      type: String, // Store the URL or path to the image
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
