import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Estate {
  id: string;
  name: string;
  location: string;
  description?: string;
  image_url?: string;
  total_units?: number;
  available_units?: number;
  sold_units?: number;
  is_active: boolean;
  account_name: string;
  account_number: string;
  bank_name: string;
  created_at: string;
  updated_at: string;
}

export interface Street {
  id: string;
  name: string;
  description?: string;
  estate_id: string;
  created_at: string;
}

// Fetch all estates
export const useEstates = (activeOnly = false) => {
  return useQuery({
    queryKey: ['estates', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('estates')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch estates: ${error.message}`);
      }

      return data as Estate[];
    },
  });
};

// Fetch single estate by ID
export const useEstate = (id: string) => {
  return useQuery({
    queryKey: ['estate', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('estates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch estate: ${error.message}`);
      }

      return data as Estate;
    },
    enabled: !!id,
  });
};

// Fetch streets for an estate
export const useStreets = (estateId?: string) => {
  return useQuery({
    queryKey: ['streets', estateId],
    queryFn: async () => {
      let query = supabase
        .from('streets')
        .select('*')
        .order('name');

      if (estateId) {
        query = query.eq('estate_id', estateId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch streets: ${error.message}`);
      }

      return data as Street[];
    },
    enabled: !!estateId,
  });
};

// Create estate (admin only)
export const useCreateEstate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (estateData: Omit<Estate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('estates')
        .insert([estateData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create estate: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estates'] });
      toast({
        title: "Success",
        description: "Estate created successfully",
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

// Update estate (admin only)
export const useUpdateEstate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Estate> }) => {
      const { data, error } = await supabase
        .from('estates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update estate: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['estates'] });
      queryClient.invalidateQueries({ queryKey: ['estate', data.id] });
      toast({
        title: "Success",
        description: "Estate updated successfully",
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

// Delete estate (admin only)
export const useDeleteEstate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('estates')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete estate: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estates'] });
      toast({
        title: "Success",
        description: "Estate deleted successfully",
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

// Create street (admin only)
export const useCreateStreet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (streetData: Omit<Street, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('streets')
        .insert([streetData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create street: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streets'] });
      toast({
        title: "Success",
        description: "Street created successfully",
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

// Update street (admin only)
export const useUpdateStreet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Street> }) => {
      const { data, error } = await supabase
        .from('streets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update street: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['streets'] });
      toast({
        title: "Success",
        description: "Street updated successfully",
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

// Delete street (admin only)
export const useDeleteStreet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('streets')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete street: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streets'] });
      toast({
        title: "Success",
        description: "Street deleted successfully",
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