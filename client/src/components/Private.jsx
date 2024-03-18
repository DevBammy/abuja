import { useSelector } from 'react-redux';
import { Outlet, Link } from 'react-router-dom';
import '../styles/auth.scss';

const Private = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? (
    <Outlet />
  ) : (
    <div className="error">
      <h1>404 ERROR</h1>
      <p>
        Kindly <Link to="/signin">sign in</Link> or{' '}
        <Link to="/signup">sign up</Link> to view this page
      </p>
    </div>
  );
};

export default Private;
