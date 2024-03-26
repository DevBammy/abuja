import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { app } from '../firebase';
import toast from 'react-hot-toast';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { updateUserSuccess, logUserOut } from '../redux/features/userSlice';
import Flyer from '../assets/flyer.png';
import '../styles/profile.scss';

const Profile = () => {
  const [showDelete, setShowDelete] = useState(false);
  const [showReg, setShowReg] = useState(false);
  const [formData, setFormData] = useState({});
  const [regFormData, setRegFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [see, setSee] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    setRegFormData(currentUser.rest);
  }, [currentUser]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageReference = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProgress(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegChange = (e) => {
    setRegFormData({
      ...regFormData,
      [e.target.id]: e.target.value,
    });
  };

  const handleShowDelete = () => {
    setShowDelete((prev) => !prev);
  };

  const handleShowPassword = () => {
    setSee((prev) => !prev);
  };

  const handleShowReg = () => {
    setShowReg((prev) => !prev);
  };

  // update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await fetch(`/api/user/update/${currentUser.rest._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setIsLoading(false);
        toast.error(data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success('Profile updated successfully');
      // setDisabled(false);
      console.log('success');
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  // registration logic
  const handleReg = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/reg/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(regFormData),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.success('Registration failed');
        return;
      } else {
        setShowReg(false);
        nav('/');
        toast.success(
          'Registration successful, Please do not register for the second time.',
          { duration: 10000 }
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const signOut = () => {
    dispatch(logUserOut());
    nav('/');
    toast.success('Signed out successfully');
  };

  return (
    <div className="profile">
      <header>
        <div className="instruct">
          {/* <p>
            Please ensure your photo is under 2MB and sized at 400 x 250 pixels.
            Larger photos may have upload issues.
          </p>
          <p>
            Visit{' '}
            <a href="https://cloudconvert.com/" target="_blank">
              CloudConvert
            </a>
            , a free online tool for file conversion and resizing.
          </p> */}
          <p>
            Online registration has ended. You are adviced to visit the
            accreditation stand for manual registration.
          </p>
        </div>

        <span onClick={signOut}>Log Out</span>
      </header>

      <div className="profileContent">
        <form onSubmit={handleSubmit} className="left">
          <div className="img">
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="input"
              required
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <img
              src={formData.avatar || currentUser.rest.avatar}
              alt=""
              onClick={() => fileRef.current.click()}
            />
          </div>

          <p className="uploading">
            {fileError ? (
              <span>Error uploading image! - Image must be less than 2 Mb</span>
            ) : fileProgress > 0 && fileProgress < 100 ? (
              <span>{`Uploading... ${fileProgress}%`}</span>
            ) : fileProgress === 100 ? (
              <span>Successfully uploaded!</span>
            ) : null}
          </p>

          <div className="text">
            <div>
              <label>
                Title<span>*</span>
              </label>
              <select
                name="title"
                id="title"
                required
                onChange={handleChange}
                defaultValue={currentUser.rest.title}
              >
                <option disabled value="">
                  Title
                </option>
                <option value="Pastor">Pastor</option>
                <option value="Assistant Pastor">Assistance Pastor</option>
                <option value="Student Pastor">Student Pastor</option>
                <option value="Elder">Elder</option>
                <option value="Deacon">Deacon</option>
                <option value="Deaconess">Deaconess</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
              </select>
            </div>
            <div>
              <label>
                Full Name<span>*</span>
              </label>
              <input
                defaultValue={currentUser.rest.fullname}
                type="text"
                placeholder="Enter your full name"
                className="input"
                id="fullname"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label>
                Email<span>*</span>
              </label>
              <input
                defaultValue={currentUser.rest.email}
                type="email"
                placeholder="enter your email"
                className="input"
                id="email"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                defaultValue={currentUser.rest.phone}
                type="tel"
                placeholder="enter your phone number"
                className="input"
                id="phone"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label>
                Assembly<span>*</span>
              </label>
              <input
                defaultValue={currentUser.rest.assembly}
                type="text"
                placeholder="Enter your assembly"
                className="input"
                id="assembly"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label>
                District<span>*</span>
              </label>
              <input
                defaultValue={currentUser.rest.district}
                type="text"
                placeholder="Enter your district"
                className="input"
                id="district"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label>
                Area<span>*</span>
              </label>
              <input
                defaultValue={currentUser.rest.area}
                type="text"
                placeholder="enter your area"
                className="input"
                id="area"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label>
                Age Group<span>*</span>
              </label>
              <select
                defaultValue={currentUser.rest.ageGroup}
                name="ageGroup"
                id="ageGroup"
                required
                onChange={handleChange}
              >
                <option value="13-20">13 - 20</option>
                <option value="21-30">21 - 30</option>
                <option value="31-40">31 - 40</option>
                <option value="40+">41 & Above</option>
              </select>
            </div>
            <div>
              <label>
                Gender<span>*</span>
              </label>
              <select
                name="gender"
                id="gender"
                onChange={handleChange}
                defaultValue={currentUser.rest.gender}
              >
                <option disabled value="">
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label>Unit</label>
              <select
                name="unit"
                id="unit"
                onChange={handleChange}
                defaultValue={currentUser.rest.unit}
              >
                <option disabled value="">
                  Unit
                </option>
                <option value="Unit">Unit</option>
                <option value="Choir">Choir</option>
                <option value="Drama">Drama</option>
                <option value="Media">Media</option>
                <option value="Medical">Medical</option>
                <option value="Prayer">Prayer</option>
                <option value="PAS">PAS</option>
                <option value="Rapporteur">Rapporteur</option>
                <option value="Ushering">Ushering</option>
                <option value="Accreditation">Accreditation</option>
                <option value="Bible Study">Bible Study</option>
                <option value="Security">Security</option>
                <option value="Nill">Nill</option>
              </select>
            </div>
            <div>
              <label>Educational Level</label>
              <select
                name="educationalLevel"
                id="educationalLevel"
                onChange={handleChange}
                defaultValue={currentUser.rest.educationalLevel}
              >
                <option disabled value="">
                  Educational Level
                </option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Tertiary">Tertiary</option>
              </select>
            </div>
            <div>
              <label>Marital Status</label>
              <select
                name="maritalStatus"
                id="maritalStatus"
                onChange={handleChange}
                defaultValue={currentUser.rest.maritalStatus}
              >
                <option disabled value="">
                  Marital Status
                </option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>
            <div className="password">
              <input
                type={see ? 'text' : 'password'}
                placeholder="Password"
                className="input psw"
                id="password"
                onChange={handleChange}
              />
              <button
                type="button"
                className="see"
                onClick={handleShowPassword}
              >
                Show Password
              </button>
            </div>
            <div className="control">
              <button type="submit" className="edit">
                Update Profile
              </button>
              {/* <button
                type="button"
                className="deleteBtn"
                onClick={handleShowDelete}
              >
                Delete Profile
              </button> */}
            </div>
          </div>
        </form>
        <div className="right">
          <h1>Up-coming Event:</h1>
          {/* <p className="scroll">
            Welcome! please ensure that you register only once.
          </p> */}
          <p className="scroll">
            Online registerations has ended. You are adviced to visit the
            accreditation stand for manual registeration
          </p>
          <div className="event">
            <div className="img">
              <img src={Flyer} alt="" />
            </div>
            <div className="text">
              <h2>TACN Abuja Metro Youth Convocation</h2>
              <p>
                <span>Date:</span> Friday 29th - Sunday 31st March, 2024
              </p>
              <p>
                <span>Venue: </span>TACN Abuja FCT Metropolitan Area Head
                Quarter. Plot 494, Durumi District, Abuja, FCT.
              </p>
              {/* <button
                type="button"
                className="register"
                onClick={handleShowReg}
              >
                Register Now
              </button> */}
              <p>ONLINE REGISTRATION CLOSED!</p>
            </div>
          </div>
        </div>
      </div>

      <div className={showDelete ? 'delete show' : 'delete'}>
        <div className="deleteContent">
          <h3>Delete Account 😒</h3>
          <p>Are you sure you will like to leave the fold?</p>
          <div className="buttons">
            <button
              type="button"
              className="del cancel"
              onClick={handleShowDelete}
            >
              Cancel
            </button>
            <button type="button" className="del">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className={showReg ? 'reg show' : 'reg'}>
        <div className="regContent">
          <form onSubmit={handleReg} className="form">
            <div>
              <span>
                Title<span>*</span>
              </span>
              <select
                name="title"
                id="title"
                required
                onChange={handleRegChange}
                defaultValue={currentUser.rest.title}
              >
                <option value="Pastor">Pastor</option>
                <option value="Assistant Pastor">Assistance Pastor</option>
                <option value="Student Pastor">Student Pastor</option>
                <option value="Elder">Elder</option>
                <option value="Deacon">Deacon</option>
                <option value="Deaconess">Deaconess</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
              </select>
            </div>
            <div>
              <span>
                Full Name<span>*</span>
              </span>
              <input
                type="text"
                placeholder="Full Name"
                onChange={handleRegChange}
                id="fullname"
                required
                className="input"
                defaultValue={currentUser.rest.fullname}
              />
            </div>
            <div>
              <span>
                Gender<span>*</span>
              </span>
              <select
                name="gender"
                id="gender"
                onChange={handleRegChange}
                defaultValue={currentUser.rest.gender}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <span>
                Phone Number<span>*</span>
              </span>
              <input
                type="tel"
                placeholder="Phone Number"
                onChange={handleRegChange}
                id="phone"
                required
                className="input"
                defaultValue={currentUser.rest.phone}
              />
            </div>

            <div>
              <span>
                Assembly<span>*</span>
              </span>
              <input
                type="text"
                placeholder="Assembly"
                onChange={handleRegChange}
                id="assembly"
                required
                className="input"
                defaultValue={currentUser.rest.assembly}
              />
            </div>
            <div>
              <span>
                District<span>*</span>
              </span>
              <input
                type="text"
                placeholder="District"
                onChange={handleRegChange}
                id="district"
                required
                className="input"
                defaultValue={currentUser.rest.district}
              />
            </div>
            <div>
              <span>
                Area<span>*</span>
              </span>
              <input
                type="text"
                placeholder="Area"
                onChange={handleRegChange}
                id="area"
                required
                className="input"
                defaultValue={currentUser.rest.area}
              />
            </div>
            <input
              type="text"
              id="regId"
              required
              className="input uid"
              defaultValue={currentUser.rest._id}
            />

            <input
              type="text"
              id="uid"
              required
              className="input uid"
              defaultValue={currentUser.rest.avatar}
            />

            <div className="buttons">
              <button type="submit">Register</button>
              <span className="cancel" onClick={handleShowReg}>
                Cancel
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
