import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const ConnectionContext = createContext<any>(null);

export const ConnectionProvider = ({ children }: { children: React.ReactNode }) => {
  const { connectors, connect, error: connectError, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useAccount();
  const [isConnected, setIsConnected] = useState(false);
  const { address, status, isConnected: connectedStatus, chain } = account;

  useEffect(() => {
    setIsConnected(connectedStatus);
  }, [connectedStatus]);

  return (
    <ConnectionContext.Provider
      value={{
        address,
        status,
        chainId: chain?.id || null,
        isConnected,
        connectStatus: connectStatus,
        connectError: connectError,
        connectors,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  return useContext(ConnectionContext);
};
