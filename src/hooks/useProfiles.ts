import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'client' | 'agent';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch all profiles (admin only)
export const useProfiles = (filters?: {
  role?: string;
  search?: string;
  is_active?: boolean;
}) => {
  const { isAdmin } = useAuth();
  
  return useQuery({
    queryKey: ['profiles', filters],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*');

      if (filters?.role && filters.role !== 'all') {
        query = query.eq('role', filters.role as 'admin' | 'client' | 'agent');
      }

      if (filters?.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }

      return data as Profile[];
    },
    enabled: isAdmin,
  });
};

// Update profile status (admin only)
export const useUpdateProfileStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update profile status: ${error.message}`);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Success",
        description: `User ${variables.is_active ? 'activated' : 'suspended'} successfully`,
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

// Get profile stats
export const useProfileStats = () => {
  const { isAdmin } = useAuth();
  
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: async () => {
      const { count: totalClients } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');

      const { count: totalAdmins } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      const { count: totalAgents } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'agent');

      const { count: suspended } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', false);

      return {
        totalClients: totalClients || 0,
        totalAdmins: totalAdmins || 0,
        totalAgents: totalAgents || 0,
        suspended: suspended || 0,
      };
    },
    enabled: isAdmin,
  });
};