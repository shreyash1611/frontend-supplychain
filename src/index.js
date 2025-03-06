import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <GoogleOAuthProvider clientId="999780560536-mb2ru3kvinplihufe4lcirvq8ae82gp7.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
  rootElement
);

