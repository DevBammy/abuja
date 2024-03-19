import mongoose from 'mongoose';

const regSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
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
    uid: {
      type: String,
    },
  },
  { timestamps: true }
);

const Register = mongoose.model('registeredUser', regSchema);

export default Register;
