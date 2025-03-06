import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import labLogo from '../styles/lablogo.png';
import labLogoSmall from '../styles/lablogo-small.png';
import veritasLogo from '../styles/veritas.png';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState('current'); 

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Google credential received');
      
      const response = await axios.post('http://localhost:5000/auth/login', {
        credential: credentialResponse.credential
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        
        localStorage.setItem('userId', response.data.userId);
        
        
        if (response.data.name) {
          console.log('Storing name from response:', response.data.name);
          localStorage.setItem('userName', response.data.name);
        } else {
          console.warn('Name not found in response');
          localStorage.setItem('userName', 'User');
        }
        
        
        if (response.data.isNewUser) {
          navigate('/profile');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Set appropriate error message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${error.response.data.error || error.response.data.details || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderCustomGoogleButton = ({ onClick }) => (
    <button 
      className="custom-google-button"
      onClick={onClick}
      aria-label="Sign in with Google"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
        alt="Google logo"
      />
    </button>
  );

  const currentFeatures = [
    {
      icon: '👥',
      title: 'Role-Based Access',
      description: 'Secure role-based access control system for managing supply chains with distinct admin and member privileges.'
    },
    {
      icon: '🔒',
      title: 'Secure Authentication',
      description: 'Safe and reliable Google OAuth2 login system ensuring secure access to your supply chain data.'
    },
    {
      icon: '🛡️',
      title: 'Privacy First',
      description: 'No sensitive data stored. We prioritize your privacy and only maintain essential information.'
    },
    {
      icon: '⚡',
      title: 'Fast Management',
      description: 'Quick response times for chain operations, allowing efficient management of supply chain details.'
    }
  ];

  const upcomingFeatures = [
    {
      icon: '🗺️',
      title: 'Real-Time Tracking',
      description: 'Live tracking of materials and shipments using Google Maps Platform, providing real-time location updates and route optimization.'
    },
    {
      icon: '⛓️',
      title: 'Blockchain Integration',
      description: 'Secure blockchain-based authentication system allowing users to join via cryptocurrency transactions for enhanced security and transparency.'
    }
  ];

  return (
    <div className="login-container">
      <a 
        href="https://www.linkedin.com/in/shreyash-chaurasia-037403233/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="built-by"
      >
        <span>Built By Shreyash Chaurasia</span>
      </a>

      <div className="login-content">
        <div className="brand-section">
          <img src={veritasLogo} alt="Veritas Logo" className="veritas-logo" />
          <h1 className="app-title">VeritasChain</h1>
        </div>
        <p className="app-subtitle">Empowering Transparency in Supply Chain Management</p>
        
        <div className="header-section">
          <img src={labLogo} alt="Lab Logo" className="lab-logo" />
          <div className="text-content">
            <p>Login with your Google account to continue</p>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
            <p>Please make sure:</p>
            <ul>
              <li>The server is running</li>
              <li>MongoDB connection is working</li>
              <li>Google OAuth is configured correctly</li>
            </ul>
          </div>
        )}
        
        <div className="google-login-button">
          {loading ? (
            <p>Logging in...</p>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={(error) => {
                console.log('Login Failed:', error);
                setError('Google login failed. Please try again.');
              }}
              useOneTap
              type="icon"
              shape="circle"
              render={renderCustomGoogleButton}
            />
          )}
        </div>
      </div>

      <div className="features-toggle">
        <button 
          className={`toggle-button ${activeFeatures === 'current' ? 'active' : ''}`}
          onClick={() => setActiveFeatures('current')}
        >
          Current Features
        </button>
        <button 
          className={`toggle-button ${activeFeatures === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveFeatures('upcoming')}
        >
          Upcoming Features
        </button>
      </div>

      <div className={`features-section ${activeFeatures ? 'visible' : ''}`}>
        {activeFeatures === 'current' ? (
          currentFeatures.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))
        ) : (
          upcomingFeatures.map((feature, index) => (
            <div className="feature-card upcoming-feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <span className="upcoming-badge">Coming Soon</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Login;
