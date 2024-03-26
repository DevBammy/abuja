import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Pix from '../assets/bg.jpg';
import '../styles/auth.scss';
// import Oauth from '../components/OAuth';

const Signup = () => {
  const [formData, setFormData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Failed to register. Please try again.');
      }
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message || 'Registration failed.');
        return;
      }
      setIsLoading(false);
      nav('/signin');
      toast.success('Registration successful. Login with your credentials.');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error('An error occurred. Please try again later.');
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
          <h1>Welcome</h1>
          {/* <p>
            Create an account to become part of something bigger than yourself.{' '}
          </p> */}
          <p>
            Sign up now and embark on an exiting adventures as we grow together
            in faith and fellowship
          </p>

          <p>
            To lodge complaints or make enquiries, please email:{' '}
            <a href="mailto:tacnabujametroyouths@gmail.com">
              tacnabujametroyouths@gmail.com
            </a>
          </p>

          <p>
            Online registration has ended. You are adviced to visit the
            accreditation stand for manual registeration
          </p>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="input"
              id="fullname"
              onChange={handleChange}
              required
            />
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
              {isLoading ? 'Creating your account...' : 'Sign Up'}
            </button>
          </form>
          <div className="account">
            <p className="account-text">
              Have an account?{' '}
              <Link to="/signin">
                <span>Sign In</span>
              </Link>
            </p>

            {/* <Oauth /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
