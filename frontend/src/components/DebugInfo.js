import React, { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';

const DebugInfo = () => {
  const [amplifyStatus, setAmplifyStatus] = useState('Checking...');
  const [userPoolId, setUserPoolId] = useState('');
  const [clientId, setClientId] = useState('');
  
  useEffect(() => {
    // Get and display environment variables
    setUserPoolId(process.env.REACT_APP_USER_POOL_ID || 'Not configured');
    setClientId(process.env.REACT_APP_USER_POOL_CLIENT_ID || 'Not configured');
    
    // Check Amplify auth configuration
    const checkAmplify = async () => {
      try {
        await getCurrentUser();
        setAmplifyStatus('Configured');
      } catch (error) {
        if (error.message === 'No current user') {
          setAmplifyStatus('Configured (No user signed in)');
        } else {
          setAmplifyStatus(`Error: ${error.message}`);
        }
      }
    };
    
    checkAmplify();
  }, []);
  
  const styles = {
    container: {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      padding: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000
    }
  };
  
  return (
    <div style={styles.container}>
      <div>Amplify Status: {amplifyStatus}</div>
      <div>User Pool ID: {userPoolId.substring(0, 4)}...{userPoolId.length > 8 ? userPoolId.substring(userPoolId.length - 4) : ''}</div>
      <div>Client ID: {clientId.substring(0, 4)}...{clientId.length > 8 ? clientId.substring(clientId.length - 4) : ''}</div>
    </div>
  );
};

export default DebugInfo; 