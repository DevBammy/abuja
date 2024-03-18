import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import Flyer from '../assets/flyer.png';
import '../styles/profile.scss';

const Profile = () => {
  const [showDelete, setShowDelete] = useState(false);
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileError, setFileError] = useState(false);

  const fileRef = useRef();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

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

  const handleShowDelete = () => {
    setShowDelete((prev) => !prev);
  };

  return (
    <div className="profile">
      <header>
        <span>Log Out</span>
      </header>

      <div className="profileContent">
        <form className="left">
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
              src={formData.avatar || currentUser.avatar}
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
            <select name="title" id="title" required onChange={handleChange}>
              <option defaultValue="Pastor">Pastor</option>
              <option value="Assistant Pastor">Assistance Pastor</option>
              <option value="Student Pastor">Student Pastor</option>
              <option value="Elder">Elder</option>
              <option value="Deacon">Deacon</option>
              <option value="Deaconess">Deaconess</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
            </select>
            <input
              type="text"
              placeholder="Full Name"
              className="input"
              id="fullname"
              required
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              className="input"
              id="email"
              required
              onChange={handleChange}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="input"
              id="phone"
              required
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Assembly"
              className="input"
              id="assembly"
              required
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="District"
              className="input"
              id="district"
              required
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Area"
              className="input"
              id="area"
              required
              onChange={handleChange}
            />
            <select
              name="ageGroup"
              id="ageGroup"
              required
              onChange={handleChange}
            >
              <option selected>Age Group</option>
              <option defaultValue="13-20">13 - 20</option>
              <option value="21-30">21 - 30</option>
              <option value="31-40">31 - 40</option>
              <option value="40+">41 & Above</option>
            </select>
            <select name="gender" id="gender" onChange={handleChange}>
              <option defaultValue="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select name="unit" id="unit" onChange={handleChange}>
              <option defaultValue="Unit">Unit</option>
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
            <select
              name="educationalLevel"
              id="educationalLevel"
              onChange={handleChange}
            >
              <option selected>Educational Level</option>
              <option defaultValue="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Tertiary">Tertiary</option>
            </select>
            <select
              name="maritalStatus"
              id="maritalStatus"
              onChange={handleChange}
            >
              <option selected>Marital Status</option>
              <option defaultValue="Single">Single</option>
              <option value="Married">Married</option>
            </select>
            <div className="control">
              <button type="button" className="edit">
                Update Profile
              </button>
              <button
                type="button"
                className="deleteBtn"
                onClick={handleShowDelete}
              >
                Delete Profile
              </button>
            </div>
          </div>
        </form>
        <div className="right">
          <h1>Up-coming Events:</h1>
          <div className="event">
            <div className="img">
              <img src={Flyer} alt="" />
            </div>
            <div className="text">
              <h2>TACN Abuja Youth Convention</h2>
              <p>
                <span>Date:</span> Fridat 29th - Sunday 31st March, 2024
              </p>
              <p>
                <span>Venue: </span>TACN Abuja FCT Metropolitan Area Head
                Quarter. Plot 494, Durumi District, Abuja, FCT.
              </p>
              <button type="button" className="register">
                Register Now
              </button>
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
    </div>
  );
};

export default Profile;
