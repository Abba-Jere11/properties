import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface GeneratedDocument {
  id: string;
  application_id: string;
  document_type: string;
  document_url: string;
  payment_percentage: number;
  generated_at: string;
}

// Fetch generated documents for an application
export const useGeneratedDocuments = (applicationId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['generated_documents', applicationId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('generated_documents')
        .select('*');

      if (applicationId) {
        query = query.eq('application_id', applicationId);
      }

      query = query.order('generated_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch generated documents: ${error.message}`);
      }

      return data as GeneratedDocument[];
    },
    enabled: !!user,
  });
};

// Fetch all generated documents for a user (client view)
export const useUserGeneratedDocuments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user_generated_documents', user?.id],
    queryFn: async () => {
      // Get user's applications first
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user?.id || '');

      if (appsError) {
        throw new Error(`Failed to fetch applications: ${appsError.message}`);
      }

      const applicationIds = applications?.map(app => app.id) || [];

      if (applicationIds.length === 0) {
        return [];
      }

      // Get generated documents for user's applications
      const { data, error } = await supabase
        .from('generated_documents')
        .select(`
          *,
          applications!inner (
            id,
            properties (
              title
            ),
            estates (
              name
            )
          )
        `)
        .in('application_id', applicationIds)
        .order('generated_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch user documents: ${error.message}`);
      }

      return data as (GeneratedDocument & {
        applications: {
          id: string;
          properties: { title: string };
          estates: { name: string };
        };
      })[];
    },
    enabled: !!user,
  });
};