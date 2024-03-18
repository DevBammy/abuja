import Flyer from '../assets/flyer.png';
import { Link } from 'react-router-dom';

import '../styles/home.scss';

const Home = () => {
  return (
    <div className="homeContainer">
      <div className="homeContent">
        <div className="left">
          <img src={Flyer} alt="" />
        </div>
        <div className="right">
          <h1>Welcome</h1>
          <p>
            Sign in or sign up with your credentials to book your space for the
            upcoming <span>TACN Abuja Area Youth Convention</span>.
          </p>
          <p>
            After successfull registration, you are adviced to complete your
            profile before proceeding to book your space for the programe.
          </p>

          <div className="btns">
            <Link className="btn" to="/signin">
              Sign In
            </Link>
            <Link className="btn btnUp" to="/signup">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
