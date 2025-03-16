import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'student'
  });

  const [status, setStatus] = useState('');

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      setStatus('User registered successfully');
    } catch (err) {
      setStatus('Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="dashboard-header">
          <h1>Register</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={form.username}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <select 
              name="userType" 
              value={form.userType} 
              onChange={onChange}
              className="form-control"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn">Register</button>
        </form>

        {status && (
          <div className={`status-message ${status.includes('failed') ? 'status-error' : 'status-success'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;