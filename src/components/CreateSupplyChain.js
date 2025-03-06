import React, { useState } from 'react';
import axios from 'axios';

const CreateSupplyChain = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chainId = Math.random().toString(36).substring(2, 10); // Generate a random chain ID

    try {
      await axios.post('http://localhost:5000/supply-chain/create', {
        name,
        description,
        chainId,
      });
      // Redirect to the chain home page
      window.location.href = `/chain/${chainId}`;
    } catch (error) {
      console.error('Error creating supply chain:', error);
    }
  };

  return (
    <div>
      <h1>Create Supply Chain</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Supply Chain Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateSupplyChain;