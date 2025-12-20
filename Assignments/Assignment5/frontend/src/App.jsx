import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateUser from './pages/CreateUser';
import GetUser from './pages/GetUser';
import UpdateUser from './pages/UpdateUser';
import DeleteUser from './pages/DeleteUser';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/create" />} />
        <Route path="/create" element={<CreateUser />} />
        <Route path="/get" element={<GetUser />} />
        <Route path="/update" element={<UpdateUser />} />
        <Route path="/delete" element={<DeleteUser />} />
      </Routes>
    </Router>
  );
};

export default App;
