import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import FitnessService, { DailyFitnessSummary } from '../services/FitnessService';

interface FitnessContextType {
  fitnessData: DailyFitnessSummary | null;
  loading: boolean;
  error: string | null;
  refreshFitnessData: () => Promise<void>;
  hasPermissions: boolean;
  requestPermissions: () => Promise<boolean>;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};

interface FitnessProviderProps {
  children: ReactNode;
}

export const FitnessProvider: React.FC<FitnessProviderProps> = ({ children }) => {
  const [fitnessData, setFitnessData] = useState<DailyFitnessSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

  const refreshFitnessData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const summary = await FitnessService.getDailyFitnessSummary();
      setFitnessData(summary);
      
      // Sync with backend
      await FitnessService.syncWithBackend(summary);
      
    } catch (err) {
      setError('Failed to fetch fitness data');
      console.error('Fitness data refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const granted = await FitnessService.requestPermissions();
      setHasPermissions(granted);
      return granted;
    } catch (err) {
      setError('Failed to request permissions');
      return false;
    }
  };

  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // You might want to check if permissions are already granted
        // This is a simplified version
        setHasPermissions(false);
      } catch (err) {
        console.error('Permission check failed:', err);
      }
    };
    
    checkPermissions();
  }, []);

  // Auto-refresh data every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasPermissions) {
        refreshFitnessData();
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [hasPermissions]);

  const value: FitnessContextType = {
    fitnessData,
    loading,
    error,
    refreshFitnessData,
    hasPermissions,
    requestPermissions
  };

  return (
    <FitnessContext.Provider value={value}>
      {children}
    </FitnessContext.Provider>
  );
};