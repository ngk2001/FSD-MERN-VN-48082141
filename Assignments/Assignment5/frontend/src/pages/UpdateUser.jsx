import React, { useState } from 'react';
import axios from 'axios';

const UpdateUser = () => {
  const [id, setId] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}`);
      console.log('Fetch single user:', res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        age: res.data.age || '',
      });
    } catch (err) {
      console.error('Fetch user error:', err);
      alert('Error fetching user');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'age'
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        formData
      );
      console.log('Update response:', res.data);
      alert('User updated');
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating user');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Update User</h2>
      <div>
        <label>User ID: </label>
        <input value={id} onChange={(e) => setId(e.target.value)} />
        <button onClick={fetchUser}>Load User</button>
      </div>
      <form onSubmit={handleUpdate} style={{ marginTop: '10px' }}>
        <div>
          <label>Name: </label>
          <input name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email: </label>
          <input name="email" value={formData.email} onChange={handleChange} type="email" />
        </div>
        <div>
          <label>Age: </label>
          <input name="age" value={formData.age} onChange={handleChange} type="number" />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateUser;
