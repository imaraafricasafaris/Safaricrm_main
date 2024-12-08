import React, { createContext, useContext, useState, useEffect } from 'react';
import { Office } from '../types/office';
import { getOffices } from '../lib/api/offices';
import toast from 'react-hot-toast';

interface OfficeContextType {
  offices: Office[];
  isLoading: boolean;
  error: string | null;
  refreshOffices: () => Promise<void>;
}

const OfficeContext = createContext<OfficeContextType | undefined>(undefined);

export function OfficeProvider({ children }: { children: React.ReactNode }) {
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOffices = async () => {
    try {
      setIsLoading(true);
      try {
        const data = await getOffices();
        setOffices(data);
        setError(null);
      } catch (err) {
        console.error('Error loading offices:', err);
        setError('Failed to load offices');
        setOffices([]);
        toast.error('Failed to load offices');
      }
    } catch (err) {
      console.error('Error loading offices:', err);
      setError('Failed to load offices');
      setOffices([]);
      toast.error('Failed to load offices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffices();
  }, []);

  return (
    <OfficeContext.Provider value={{
      offices,
      isLoading,
      error,
      refreshOffices: loadOffices
    }}>
      {children}
    </OfficeContext.Provider>
  );
}

export function useOffices() {
  const context = useContext(OfficeContext);
  if (context === undefined) {
    throw new Error('useOffices must be used within an OfficeProvider');
  }
  return context;
}