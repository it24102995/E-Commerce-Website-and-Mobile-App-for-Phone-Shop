import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { trackingService } from '../service/trackingService';

const DeliverSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    vehicleNumber: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await trackingService.riderSignup(formData);
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'You can now log in as a delivery person.',
        confirmButtonColor: '#3b82f6',
      });
      navigate('/deliver-login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: 'Email already exists or invalid data.',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Rider Signup</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg"
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg"
          />
          <input
            name="vehicleNumber"
            placeholder="Vehicle Number"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4">
          Already a rider? <button onClick={() => navigate('/deliver-login')} className="text-blue-600 font-bold">Login</button>
        </p>
      </div>
    </div>
  );
};

export default DeliverSignup;
