import { supabase } from '../supabase';
import { Lead } from '../../types/leads';
import { parse, unparse } from 'papaparse';

interface CSVLead {
  name: string;
  email: string;
  phone?: string;
  country: string;
  destinations?: string;
  trip_type?: string;
  duration?: string;
  arrival_date?: string;
  adults?: string;
  children?: string;
  budget?: string;
  message?: string;
  marketing_consent?: string;
}

export async function importLeadsFromCSV(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    parse(file, {
      delimiter: '',  // Auto-detect delimiter
      encoding: 'utf-8', 
      transformHeader: (header) => header.trim().toLowerCase(),
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (!value) return null;
        value = value.trim();

        // Type conversions based on field
        switch (field) {
          case 'budget':
            return value ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : null;
          case 'duration':
          case 'adults':
          case 'children':
            return value ? parseInt(value, 10) : null;
          case 'marketing_consent':
            return value.toLowerCase() === 'true' || value === '1';
          case 'destinations':
          case 'trip_type':
            return value ? value.split(',').map(v => v.trim()) : [];
          default:
            return value;
        }
      },
      dynamicTyping: true,
      complete: async (results) => {
        try {
          if (results.errors?.length > 0) {
            const errorMsg = results.errors
              .filter(e => e.row !== undefined)  // Only show row-specific errors
              .map(e => `Row ${e.row + 1}: ${e.message}`)
              .join('\n');
            throw new Error(`Failed to parse CSV file: ${errorMsg}`);
          }

          // Validate required fields
          const requiredFields = ['name', 'email', 'country'];
          const headers = Object.keys(results.data[0] || {});
          const missingFields = requiredFields.filter(field => !headers.includes(field));
          
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }

          // Validate data format
          const leads = (results.data as CSVLead[]).map((row, index) => {
            // Validate email format
            if (!row.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim())) {
              throw new Error(`Invalid email format at row ${index + 1}: ${row.email}`);
            }

            // Validate required string fields
            if (!row.name?.trim()) {
              throw new Error(`Missing name at row ${index + 1}`);
            }
            if (!row.country?.trim()) {
              throw new Error(`Missing country at row ${index + 1}`);
            }

            // Validate date format if provided
            const arrivalDate = row.arrival_date?.trim();
            if (arrivalDate && !/^\d{4}-\d{2}-\d{2}/.test(arrivalDate)) {
              throw new Error(`Invalid date format at row ${index + 1}. Use YYYY-MM-DD format`);
            }

            // Validate numeric fields
            const budget = row.budget?.toString().trim();
            if (budget && isNaN(parseFloat(budget))) {
              throw new Error(`Invalid budget format at row ${index + 1}`);
            }

            return {
              name: row.name.trim(),
              email: row.email.trim(),
              phone: row.phone?.trim(),
              country: row.country.trim(),
              status: (row.status?.toLowerCase() || 'new') as Lead['status'],
              source: (row.source?.toLowerCase() || 'import') as Lead['source'],
              budget: budget ? parseFloat(budget) : null,
              message: row.message?.trim(),
              destinations: Array.isArray(row.destinations) ? row.destinations : [],
              trip_type: Array.isArray(row.trip_type) ? row.trip_type : [],
              duration: typeof row.duration === 'number' ? row.duration : 1,
              arrival_date: arrivalDate || null,
              adults: typeof row.adults === 'number' ? row.adults : 1,
              children: typeof row.children === 'number' ? row.children : 0,
              marketing_consent: row.marketing_consent?.toLowerCase() === 'true'
            };
          });

          // Validate data
          if (leads.length === 0) {
            throw new Error('No valid leads found in file');
          }

          // Insert in batches of 100
          const batchSize = 100;
          for (let i = 0; i < leads.length; i += batchSize) {
            const batch = leads.slice(i, i + batchSize);
            const { error } = await supabase.from('leads').insert(batch);
            if (error) {
              throw new Error(`Database error on batch ${i / batchSize + 1}: ${error.message}`);
            }
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export async function exportLeadsToCSV(): Promise<string> {
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .throwOnError();

  if (error) throw error;

  // Transform data for export
  const exportData = leads.map(lead => ({
    name: lead.name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    country: lead.country || '',
    status: lead.status || '',
    source: lead.source || '',
    destinations: Array.isArray(lead.destinations) ? lead.destinations.join(', ') : '',
    trip_type: Array.isArray(lead.trip_type) ? lead.trip_type.join(', ') : '',
    duration: lead.duration || '',
    arrival_date: lead.arrival_date || '',
    adults: lead.adults || '',
    children: lead.children || 0,
    budget: lead.budget || '',
    message: lead.message || '',
    marketing_consent: lead.marketing_consent ? 'Yes' : 'No'
  }));

  const csv = unparse(exportData, {
    quotes: true,
    delimiter: ',',
    header: true
  });

  return csv;
}

export function downloadCSV(csv: string, filename: string = 'leads.csv'): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}