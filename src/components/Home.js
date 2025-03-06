import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUserId, getUserName, logout } from '../utils/auth';
import '../styles/Home.css';
import Navbar from './Navbar';
import config from '../config/config';

const Home = () => {
  const [chains, setChains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Welcome');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          navigate('/');
          return;
        }

        const name = getUserName();
        setUserName(`Welcome, ${name}`);

        try {
          const chainsResponse = await axios.get(`${config.API_URL}/chain/user/${userId}`);
          setChains(chainsResponse.data.chains || []);
        } catch (chainsError) {
          console.error('Error fetching chains:', chainsError);
          setChains([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleCreateJoin = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
  };

  const handleViewChain = (chainId) => {
    navigate(`/chain/${chainId}`);
  };

  if (loading) {
    return <div className="loading">Loading your supply chains...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="header">
          <h2>{userName}</h2>
          <div className="header-buttons">
            <button onClick={handleCreateJoin} className="create-join-button">
              +
            </button>
            <button onClick={handleLogout} className="logout-button">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png" 
                alt="Logout" 
                className="logout-icon" 
              />
              Logout
            </button>
          </div>
        </div>

        <h3>Your Supply Chains</h3>

        {chains.length === 0 ? (
          <div className="no-chains">
            <p>You don't have any supply chains yet.</p>
            <p>Click the "+" button to create or join a supply chain.</p>
          </div>
        ) : (
          <div className="chains-grid">
            {chains.map(chain => (
              <div key={chain.chainId} className="chain-card">
                <h3>{chain.name}</h3>
                <p className="chain-id">
                  <strong>Chain ID:</strong> {chain.chainId}
                </p>
                <p className="role">
                  <strong>Your Role:</strong> {chain.role === 'admin' ? 'Admin' : 'Member'}
                </p>
                <button 
                  onClick={() => handleViewChain(chain.chainId)}
                  className="view-chain-button"
                >
                  View Chain
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
