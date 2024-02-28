import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import Swal from 'sweetalert2';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', job: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('https://reqres.in/api/users')
      .then(response => {
        setUsers(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching users: ', error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddUser = () => {
    axios.post('https://reqres.in/api/users', newUser)
      .then(response => {
        if (newUser.name.trim() === ''|| newUser.job.trim() === '') {
          Swal.fire({
            icon: "warning",
            title: "Trường input không được trống!",
            showConfirmButton: false,
          });
        }else{
          fetchUsers();
          setNewUser({ name: '', job: '' }); 
          Swal.fire({
            icon: "success",
            title: "Bạn đã thêm user thành công",
            showConfirmButton: false,
          });
        }
      })
      .catch(error => {
        Swal.fire({
          icon: "warning",
          title: "Error adding user: "+error,
          showConfirmButton: false,
        });
      });
  };

  const handleDeleteUser = (userId) => {
    axios.delete(`https://reqres.in/api/users/${userId}`)
      .then(response => {
        Swal.fire({
          icon: "success",
          title: "Bạn đã xoá user thành công",
          showConfirmButton: false,
        });
        fetchUsers();
      })
      .catch(error => {
        Swal.fire({
          icon: "warning",
          title: "Error deleting user: "+error,
          showConfirmButton: false,
        });
      });
  };

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.first_name} {user.last_name} - {user.email}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>Add New User</h2>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={newUser.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        placeholder="Job"
        name="job"
        value={newUser.job}
        onChange={handleInputChange}
      />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );

}

export default App
