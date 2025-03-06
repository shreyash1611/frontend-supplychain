import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data after login
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          withCredentials: true,  // Make sure cookies (sessions) are sent
        });
        setUser(response.data);  // Set user data
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {/* Add more profile info as needed */}
    </div>
  );
}

export default Dashboard;
