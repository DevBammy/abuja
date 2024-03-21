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
          <p>Create an account or sign in to continue</p>
          <p>
            To lodge complaints or make enquiries, please email:{' '}
            <a href="mailto:tacnabujametroyouths@gmail.com">
              tacnabujametroyouths@gmail.com
            </a>
          </p>
          <p>
            You are adviced to complete your profile before proceeding to book
            your space for the program
          </p>

          <div className="btns">
            <Link className="btn" to="/signin">
              Sign In
            </Link>
            <Link className="btn btnUp" to="/signup">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
