import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'age'
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users', formData);
      console.log('Create response:', res.data);
      alert('User created');
      setFormData({ name: '', email: '', age: '' });
    } catch (err) {
      console.error('Create error:', err);
      alert('Error creating user');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
          />
        </div>
        <div>
          <label>Age: </label>
          <input
            name="age"
            value={formData.age}
            onChange={handleChange}
            type="number"
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateUser;
