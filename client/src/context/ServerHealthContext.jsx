import { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../utils/api";

const ServerHealthContext = createContext();

export const useServerHealth = () => {
  const context = useContext(ServerHealthContext);
  if (!context) {
    throw new Error("useServerHealth must be used within ServerHealthProvider");
  }
  return context;
};

export const ServerHealthProvider = ({ children }) => {
  const [serverStatus, setServerStatus] = useState({
    isHealthy: false,
    isChecking: true,
    lastChecked: null,
    error: null,
  });

  const checkServerHealth = async () => {
    setServerStatus((prev) => ({ ...prev, isChecking: true }));

    try {
      const result = await ApiService.checkHealth();
      setServerStatus({
        isHealthy: result.healthy,
        isChecking: false,
        lastChecked: new Date(),
        error: result.error || null,
      });
    } catch (error) {
      setServerStatus({
        isHealthy: false,
        isChecking: false,
        lastChecked: new Date(),
        error: error.message,
      });
    }
  };

  useEffect(() => {
    // Initial health check
    checkServerHealth();

    // Check health every 30 seconds
    const interval = setInterval(checkServerHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    ...serverStatus,
    recheckHealth: checkServerHealth,
  };

  return (
    <ServerHealthContext.Provider value={value}>
      {children}
    </ServerHealthContext.Provider>
  );
};
