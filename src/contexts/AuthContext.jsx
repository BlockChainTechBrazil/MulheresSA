import { useState } from 'react';
import { AuthContext } from './AuthContextDefinition.js';

export const AuthProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const login = (address) => {
    setIsConnected(true);
    setWalletAddress(address);
  };

  const logout = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  return (
    <AuthContext.Provider
      value={{
        isConnected,
        walletAddress,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
