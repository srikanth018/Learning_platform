import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If no token is found, redirect to login page
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
