import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  lot_size?: string;
  property_type?: string;
  images?: string[];
  amenities?: string[];
  status: 'available' | 'reserved' | 'sold' | 'under_construction';
  is_featured: boolean;
  payment_plans?: ('outright' | 'musharakah' | 'murabahah' | 'ijarah')[];
  estate_id: string;
  street_id?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  estates?: {
    id: string;
    name: string;
    location: string;
    description?: string;
    image_url?: string;
    account_name: string;
    account_number: string;
    bank_name: string;
  };
  streets?: {
    id: string;
    name: string;
    description?: string;
  };
}

// Fetch all properties with estate and street data
export const useProperties = (filters?: {
  estate_id?: string;
  status?: string;
  is_featured?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select(`
          *,
          estates (
            id,
            name,
            location,
            description,
            image_url,
            account_name,
            account_number,
            bank_name
          ),
          streets (
            id,
            name,
            description
          )
        `);

      // Apply filters
      if (filters?.estate_id) {
        query = query.eq('estate_id', filters.estate_id);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status as any);
      }
      
      if (filters?.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch properties: ${error.message}`);
      }

      return data as unknown as Property[];
    },
  });
};

// Fetch single property by ID
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          estates (
            id,
            name,
            location,
            description,
            image_url,
            account_name,
            account_number,
            bank_name
          ),
          streets (
            id,
            name,
            description
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch property: ${error.message}`);
      }

      return data as unknown as Property;
    },
    enabled: !!id,
  });
};

// Fetch featured properties
export const useFeaturedProperties = () => {
  return useProperties({ is_featured: true });
};

// Create property (admin only)
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData as any])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create property: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: "Success",
        description: "Property created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
};

// Update property (admin only)
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Property> }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update property: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', data.id] });
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
};

// Delete property (admin only)
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete property: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
};