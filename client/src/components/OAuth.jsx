import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { signInSuccess } from '../redux/features/userSlice';
import toast from 'react-hot-toast';
import Google from '../assets/google.png';
import '../styles/auth.scss';

const Oauth = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      nav('/profile');
      toast.success('Welcome to your dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button type="button" onClick={handleGoogleSignIn} className="oauth">
        Continue With Google <img className="google" src={Google} alt="" />
      </button>
    </>
  );
};

export default Oauth;
