import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/auth';
import '../styles/ChainDetails.css';
import Navbar from './Navbar';

const ChainDetails = () => {
  const { chainId } = useParams();
  const [chain, setChain] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChainData = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          navigate('/');
          return;
        }

        console.log(`Fetching details for chain: ${chainId}`);
        
        // Get chain details
        const chainResponse = await axios.get(`http://localhost:5000/chain/${chainId}`);
        console.log('Chain response:', chainResponse.data);
        
        if (chainResponse.data.success) {
          setChain(chainResponse.data.chain);
          
          // Check if user is admin
          const userChains = await axios.get(`http://localhost:5000/chain/user/${userId}`);
          const userChain = userChains.data.chains.find(c => c.chainId === chainId);
          
          if (userChain && userChain.role === 'admin') {
            console.log('User is admin of this chain');
            setIsAdmin(true);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chain data:', error);
        setError('Failed to load chain details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchChainData();
  }, [chainId, navigate]);

  const handleBack = () => {
    navigate('/home');
  };

  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };

  if (loading) {
    return <div className="chain-details-container">Loading chain details...</div>;
  }

  if (error) {
    return (
      <div className="chain-details-container">
        <div className="error-message">{error}</div>
        <button onClick={handleBack} className="back-button">
          ← Back to Home
        </button>
      </div>
    );
  }

  if (!chain) {
    return (
      <div className="chain-details-container">
        <h2>Chain not found</h2>
        <button onClick={handleBack} className="back-button">
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="chain-details-container">
        <button onClick={handleBack} className="back-button">
          ← Back to Home
        </button>
        
        <h1 className="chain-title">{chain.name}</h1>
        
        {isAdmin && (
          <button onClick={toggleMembers} className="toggle-members-button">
            {showMembers ? 'Hide Members' : 'Show Members'}
          </button>
        )}

        {isAdmin && showMembers && (
          <div className="members-section">
            <h2>Chain Members</h2>
            <div className="chain-id-share">
              Share this Chain ID with others to let them join: <strong>{chain.chainId}</strong>
            </div>
            
            <table className="members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {chain.members.map((member, index) => (
                  <tr key={index}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.role === 'admin' ? 'Admin' : 'Member'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!isAdmin && (
          <div className="member-view">
            <p>You are a member of this supply chain.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ChainDetails; 