// Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem('token');

    // Redirect the user to the login page
    navigate('/admin/login');
  };

  useEffect(() => {
    handleLogout();
  })
}

export default Logout;