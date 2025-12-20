import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetUser = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      console.log('Get users response:', res.data);
      setUsers(res.data);
    } catch (err) {
      console.error('Get users error:', err);
      alert('Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Users</h2>
      <button onClick={fetchUsers}>Refresh</button>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u._id} - {u.name} - {u.email} - {u.age}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetUser;
