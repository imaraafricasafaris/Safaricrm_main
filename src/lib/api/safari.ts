import { supabase } from '../supabase';
import type { SafariPackage, Itinerary } from '../database/types';

export async function getSafariPackages(filters?: {
  destination?: string;
  duration?: number;
  price_range?: { min: number; max: number };
  accommodation_level?: string;
}) {
  let query = supabase.from('safari_packages').select('*');

  if (filters?.destination) {
    query = query.contains('destinations', [filters.destination]);
  }

  if (filters?.duration) {
    query = query.eq('duration', filters.duration);
  }

  if (filters?.price_range) {
    query = query.gte('pricing->base_price', filters.price_range.min)
                .lte('pricing->base_price', filters.price_range.max);
  }

  if (filters?.accommodation_level) {
    query = query.eq('accommodation_level', filters.accommodation_level);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data as SafariPackage[];
}

export async function createItinerary(itinerary: Omit<Itinerary, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('itineraries')
    .insert(itinerary)
    .select()
    .single();

  if (error) throw error;
  return data as Itinerary;
}

export async function calculatePackagePrice(
  packageId: string,
  startDate: string,
  participants: { adults: number; children: number }
) {
  const { data: pkg, error } = await supabase
    .from('safari_packages')
    .select('*')
    .eq('id', packageId)
    .single();

  if (error) throw error;

  const basePrice = pkg.pricing.base_price;
  const seasonalRate = pkg.pricing.seasonal_rates.find(
    rate => 
      new Date(startDate) >= new Date(rate.start_date) &&
      new Date(startDate) <= new Date(rate.end_date)
  );

  const rateMultiplier = seasonalRate?.rate_multiplier || 1;
  const adultPrice = basePrice * rateMultiplier * participants.adults;
  const childPrice = basePrice * rateMultiplier * 0.7 * participants.children;

  return {
    total: adultPrice + childPrice,
    breakdown: {
      adults: adultPrice,
      children: childPrice,
      seasonal_rate: rateMultiplier,
      currency: pkg.pricing.currency
    }
  };
}