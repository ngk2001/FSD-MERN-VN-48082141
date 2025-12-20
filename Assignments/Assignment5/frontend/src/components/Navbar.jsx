import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navStyle = {
    padding: '10px',
    backgroundColor: '#282c34',
    display: 'flex',
    gap: '15px',
  };
  const linkStyle = { color: 'white', textDecoration: 'none' };

  return (
    <nav style={navStyle}>
      <Link to="/create" style={linkStyle}>Create User</Link>
      <Link to="/get" style={linkStyle}>Get Users</Link>
      <Link to="/update" style={linkStyle}>Update User</Link>
      <Link to="/delete" style={linkStyle}>Delete User</Link>
    </nav>
  );
};

export default Navbar;
