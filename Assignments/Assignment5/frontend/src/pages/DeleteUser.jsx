import React, { useState } from 'react';
import axios from 'axios';

const DeleteUser = () => {
  const [id, setId] = useState('');

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/users/${id}`);
      console.log('Delete response:', res.data);
      alert('User deleted');
      setId('');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting user');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Delete User</h2>
      <div>
        <label>User ID: </label>
        <input value={id} onChange={(e) => setId(e.target.value)} />
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default DeleteUser;
