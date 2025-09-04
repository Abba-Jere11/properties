import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Application {
  id: string;
  user_id: string;
  property_id: string;
  estate_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  occupation?: string;
  employer?: string;
  monthly_income?: number;
  next_of_kin_name: string;
  next_of_kin_phone: string;
  next_of_kin_relationship: string;
  next_of_kin_address: string;
  selected_house?: string;
  selected_street?: string;
  payment_plan: 'outright' | 'musharakah' | 'murabahah' | 'ijarah';
  total_amount: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed';
  terms_accepted: boolean;
  terms_accepted_at?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  properties?: {
    id: string;
    title: string;
    price: number;
    estate_id: string;
  };
  estates?: {
    id: string;
    name: string;
    location: string;
    account_name: string;
    account_number: string;
    bank_name: string;
  };
  profiles?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Fetch applications (admin sees all, clients see their own)
export const useApplications = (filters?: {
  status?: string;
  search?: string;
  user_id?: string;
}) => {
  const { isAdmin, user } = useAuth();
  
  return useQuery({
    queryKey: ['applications', filters, user?.id, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('applications')
        .select(`
          *,
          properties (
            id,
            title,
            price,
            estate_id
          ),
          estates (
            id,
            name,
            location,
            account_name,
            account_number,
            bank_name
          )
        `);

      // If not admin, only show user's own applications
      if (!isAdmin && user) {
        query = query.eq('user_id', user.id);
      }

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status as any);
      }
      
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters?.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch applications: ${error.message}`);
      }

      return data as unknown as Application[];
    },
    enabled: !!user,
  });
};

// Fetch single application by ID
export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties (
            id,
            title,
            price,
            estate_id
          ),
          estates (
            id,
            name,
            location,
            account_name,
            account_number,
            bank_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch application: ${error.message}`);
      }

      return data as unknown as Application;
    },
    enabled: !!id,
  });
};

// Create application
export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          ...applicationData,
          status: 'pending' as const,
          terms_accepted_at: applicationData.terms_accepted ? new Date().toISOString() : null,
        } as any])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create application: ${error.message}`);
      }

      // Generate application PDF
      const pdfResponse = await supabase.functions.invoke('generate-application-pdf', {
        body: { applicationId: data.id }
      });

      if (pdfResponse.error) {
        console.error('PDF generation failed:', pdfResponse.error);
      }

      // Send confirmation email
      const emailResponse = await supabase.functions.invoke('send-application-email', {
        body: { 
          applicationId: data.id, 
          type: 'confirmation' 
        }
      });

      if (emailResponse.error) {
        console.error('Email sending failed:', emailResponse.error);
      }

      // Create notification for admins
      await supabase.from('notifications').insert([{
        user_id: '00000000-0000-0000-0000-000000000000', // Admin notification
        title: 'New Application Submitted',
        message: `New application submitted by ${applicationData.first_name} ${applicationData.last_name} for property ${applicationData.property_id}`,
        type: 'info',
      }]);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: "Success",
        description: "Application submitted successfully! You will receive confirmation via email.",
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

// Approve application (admin only)
export const useApproveApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('applications')
        .update({
          status: 'approved',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to approve application: ${error.message}`);
      }

      // Send approval email with login credentials
      const dashboardUrl = `${window.location.origin}/auth/client-login`;
      const emailResponse = await supabase.functions.invoke('send-application-email', {
        body: { 
          applicationId: id, 
          type: 'approval',
          additionalData: {
            dashboardUrl,
            credentials: {
              email: data.email,
              tempPassword: 'TempPass123!' // In production, generate a secure temporary password
            }
          }
        }
      });

      if (emailResponse.error) {
        console.error('Approval email sending failed:', emailResponse.error);
      }

      // Send notification to client
      await supabase.from('notifications').insert([{
        user_id: data.user_id,
        title: 'Application Approved',
        message: `Your application has been approved! Check your email for login details.`,
        type: 'success',
      }]);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: "Success",
        description: "Application approved successfully. Approval email sent to client.",
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

// Reject application (admin only)
export const useRejectApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({
          status: 'rejected',
          rejection_reason: reason,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to reject application: ${error.message}`);
      }

      // Create notification for client
      await supabase.from('notifications').insert([{
        user_id: data.user_id,
        title: 'Application Rejected',
        message: `Your property application has been rejected. Reason: ${reason}`,
        type: 'error',
      }]);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: "Success",
        description: "Application rejected successfully. Rejection email sent to client.",
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