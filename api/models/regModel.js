import mongoose from 'mongoose';

const regSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    fullname: {
      type: String,
    },
    email: {
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
    gender: {
      type: String,
    },
    ageGrpup: {
      type: String,
    },
    unit: {
      type: String,
    },
  },
  { timestamps: true }
);

const Register = mongoose.model('registeredUser', regSchema);

export default Register;
