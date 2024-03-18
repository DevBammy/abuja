import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  signInFailed,
  signInStart,
  signInSuccess,
} from '../redux/features/userSlice';
import toast from 'react-hot-toast';
import Pix from '../assets/bg.jpg';
import '../styles/auth.scss';
import Oauth from '../components/OAuth';

const Signin = () => {
  const [formData, setFormData] = useState({});
  const { isLoading, error } = useSelector((state) => state.user);

  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailed(data.message));
        toast(data.message);
        return;
      }
      dispatch(signInSuccess(data.user));
      nav('/profile');
    } catch (error) {
      dispatch(signInFailed(error.message));
      toast(error.message);
    }
  };

  return (
    <div className="container">
      <div className="overlay"></div>

      <div className="content">
        <div className="left">
          <img src={Pix} alt="" />
        </div>
        <div className="right">
          <h1>Welcome Back! </h1>
          <p>Login with your credentials</p>

          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="email"
              className="input"
              id="email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="password"
              className="input"
              id="password"
              onChange={handleChange}
              required
            />
            <button disabled={isLoading} type="submit" className="submit">
              {isLoading ? 'Signing you in...' : 'Sign In'}
            </button>
          </form>
          <div className="account">
            <p className="account-text">
              dont have an account?{' '}
              <Link to="/signup">
                <span>Sign Up</span>
              </Link>
            </p>

            <Oauth />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
