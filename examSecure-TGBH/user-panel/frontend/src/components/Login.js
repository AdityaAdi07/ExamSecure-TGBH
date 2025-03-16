import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userType', res.data.userType);
      localStorage.setItem('userId', res.data.userId);

      setStatus('Login successful');
      
      if (res.data.userType === 'admin') {
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        setTimeout(() => navigate('/student'), 1000);
      }
    } catch (err) {
      setStatus('Login failed');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="dashboard-header">
          <h1>Login</h1>
          <p>Access your account</p>
        </div>

        <form onSubmit={onSubmit}>
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

          <button type="submit" className="btn">Login</button>
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

export default Login;