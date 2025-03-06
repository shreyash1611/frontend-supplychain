import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import Navbar from './Navbar';
import config from '../config/config';

const Profile = () => {
  const [role, setRole] = useState('');
  const [chainId, setChainId] = useState('');
  const [chainName, setChainName] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      // Redirect to login if no userId found
      navigate('/');
      return;
    }
    setUserId(storedUserId);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    try {
      if (role === 'admin') {
        // Create new chain
        const response = await axios.post(`${config.API_URL}/chain/create`, {
          name: chainName,
          userId: userId
        });
        
        if (response.data.success) {
          console.log('Chain created successfully:', response.data);
          navigate('/home');
        }
      } else if (role === 'user') {
        // Join existing chain
        try {
          const response = await axios.post(`${config.API_URL}/chain/join`, {
            chainId,
            userId: userId
          });
          
          if (response.data.success) {
            console.log('Joined chain successfully:', response.data);
            navigate('/home');
          }
        } catch (joinError) {
          if (joinError.response && joinError.response.data) {
            setError(joinError.response.data.error);
          } else {
            setError('Failed to join chain. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError('Operation failed. Please try again.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2>Welcome! What would you like to do?</h2>
        <div className="role-selection">
          <button 
            className={`role-button ${role === 'admin' ? 'selected' : ''}`} 
            onClick={() => {
              setRole('admin');
              setError(''); // Clear error when switching roles
            }}
          >
            Create a New Supply Chain
          </button>
          <button 
            className={`role-button ${role === 'user' ? 'selected' : ''}`} 
            onClick={() => {
              setRole('user');
              setError(''); // Clear error when switching roles
            }}
          >
            Join Existing Supply Chain
          </button>
        </div>
        
        {role && (
          <form onSubmit={handleSubmit} className="chain-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {role === 'admin' && (
              <div className="form-group">
                <label>Enter Chain Name:</label>
                <input
                  type="text"
                  placeholder="e.g., Textile Supply Chain"
                  value={chainName}
                  onChange={(e) => setChainName(e.target.value)}
                  required
                />
              </div>
            )}
            
            {role === 'user' && (
              <div className="form-group">
                <label>Enter Chain ID:</label>
                <input
                  type="text"
                  placeholder="e.g., a1b2c3d4"
                  value={chainId}
                  onChange={(e) => setChainId(e.target.value)}
                  required
                />
              </div>
            )}
            
            <button type="submit" className="submit-button">Continue</button>
          </form>
        )}
      </div>
    </>
  );
};

export default Profile;