import React, { useState } from 'react';
import Button from '../components/Button';
import logo from '../assets/imgs/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.BACKEND_HOST}/auth/login`, formData);

      const token = response.data.token;

      localStorage.setItem('token', token);

      navigate('/admin/attendees');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className='pino-attendee-form'>
      <form className='col-lg-6 col-md-10 col-sm-11' onSubmit={handleSubmit}>
        <img src={logo} alt="logo" className='logo' />
        {error && <div className="error-message text-danger fw-bold mt-4">{error}</div>}
        <div className='pino-inputGroup'>
          <label className='fw-bold' htmlFor="email">البريد الالكتروني</label>
          <input
            type="email"
            id="email"
            className="input"
            name="email"
            value={formData.email}
            required
            placeholder='مثال: admin@admin.com'
            onChange={handleChange}
          />
        </div>

        <div className='pino-inputGroup'>
          <label className='fw-bold' htmlFor="password">كلمة السر</label>
          <input
            type="password"
            id="password"
            className="input"
            name="password"
            value={formData.password}
            required
            onChange={handleChange}
            placeholder='كلمة السر الخاصة بلوحة التحكم'
          />
        </div>

        <Button type="submit" text="سجل دخولك" />
      </form>
    </div>
  );
}

export default Login;
