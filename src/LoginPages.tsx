import React, { useState } from 'react';
import axios from 'axios';
import ParametersPage from './ParametersTeam';
import 'bootstrap/dist/css/bootstrap.css';

const LoginPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Perform validation and API key check here
      const config = {
        method: 'get',
        url: 'https://v3.football.api-sports.io/status',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
      };

      const response = await axios(config);
      if (response.data.results > 0) {
        console.log('Valid API key');
        console.log(response.data);
        setIsLoggedIn(true);
        setFirstName(response.data.response.account.firstname);
        setShowWelcomePopup(true);
        setTimeout(() => {
          setShowWelcomePopup(false);
        }, 4000); // Adjusted to 4 seconds
      } else {
        console.log('Invalid API key');
        setError('Invalid API key. Please try again.');
        setTimeout(() => {
          setError('');
        }, 4000); // Adjusted to 4 seconds
        setTimeout(() => {
          setError('');
        }, 4000); // Adjusted to 4 seconds
      }
    } catch (error) {
      console.log('Invalid API key');
      setError('Invalid API key. Please try again.');
      setTimeout(() => {
        setError('');
      }, 4000); // Adjusted to 4 seconds
      setTimeout(() => {
        setError('');
      }, 4000); // Adjusted to 4 seconds
    }
  };

  if (isLoggedIn) {
    return <ParametersPage apiKey={apiKey} />;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center">Football Login</h3>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                className="btn btn-primary btn-block"
                onClick={handleLogin}
              >
                Login
              </button>
              {showWelcomePopup && (
                <div className="alert alert-success mt-3">
                  Welcome {firstName}!
                </div>
              )}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {isLoggedIn && !showWelcomePopup && !error && (
                <div className="alert alert-info mt-3">Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
