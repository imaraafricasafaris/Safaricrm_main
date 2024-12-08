import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Staff } from '../types/staff';
import toast from 'react-hot-toast';

interface StaffContextType {
  staff: Staff[];
  isLoading: boolean;
  error: string | null;
  addStaff: (data: Partial<Staff>) => Promise<void>;
  updateStaff: (id: string, data: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  toggleStaffStatus: (id: string) => Promise<void>;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaff(data as Staff[]);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff members');
      toast.error('Failed to load staff members');
    } finally {
      setIsLoading(false);
    }
  };

  const addStaff = async (data: Partial<Staff>) => {
    try {
      const { data: newStaff, error } = await supabase
        .from('staff')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setStaff(prev => [newStaff as Staff, ...prev]);
      toast.success('Staff member added successfully');
    } catch (err) {
      console.error('Error adding staff:', err);
      toast.error('Failed to add staff member');
      throw err;
    }
  };

  const updateStaff = async (id: string, data: Partial<Staff>) => {
    try {
      const { error } = await supabase
        .from('staff')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      setStaff(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
      toast.success('Staff member updated successfully');
    } catch (err) {
      console.error('Error updating staff:', err);
      toast.error('Failed to update staff member');
      throw err;
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setStaff(prev => prev.filter(s => s.id !== id));
      toast.success('Staff member deleted successfully');
    } catch (err) {
      console.error('Error deleting staff:', err);
      toast.error('Failed to delete staff member');
      throw err;
    }
  };

  const toggleStaffStatus = async (id: string) => {
    const staffMember = staff.find(s => s.id === id);
    if (!staffMember) return;

    const newStatus = staffMember.status === 'active' ? 'inactive' : 'active';
    await updateStaff(id, { status: newStatus });
  };

  return (
    <StaffContext.Provider value={{
      staff,
      isLoading,
      error,
      addStaff,
      updateStaff,
      deleteStaff,
      toggleStaffStatus
    }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
}