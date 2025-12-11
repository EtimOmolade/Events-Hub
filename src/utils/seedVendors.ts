import { supabase } from '@/integrations/supabase/client';
import { vendors } from '@/data/services';

export const seedVendors = async () => {
  console.log('Seeding vendors...');

  const results = [];

  for (const vendor of vendors) {
    // Check if vendor already exists by name
    const { data: existing } = await supabase
      .from('vendors')
      .select('id')
      .eq('name', vendor.name)
      .single();

    if (existing) {
      console.log(`Vendor ${vendor.name} already exists with ID: ${existing.id}`);
      results.push({ name: vendor.name, id: existing.id, status: 'existed' });
      continue;
    }

    // Insert new vendor
    const { data, error } = await supabase
      .from('vendors')
      .insert({
        name: vendor.name,
        specialty: vendor.specialty,
        bio: vendor.bio,
        avatar: vendor.avatar,
        location: vendor.location,
        rating: vendor.rating,
        review_count: vendor.reviewCount,
        verified: vendor.verified,
        status: 'approved' // Default to approved for seeded vendors
      })
      .select()
      .single();

    if (error) {
      console.error(`Failed to seed ${vendor.name}:`, error);
      results.push({ name: vendor.name, status: 'error', error });
    } else {
      console.log(`Seeded ${vendor.name} with ID: ${data.id}`);
      results.push({ name: vendor.name, id: data.id, status: 'created' });
    }
  }

  return results;
};
