import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Payment {
  id: string;
  user_id: string;
  application_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'processing' | 'failed' | 'cancelled';
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  verified_by?: string;
  verified_at?: string;
  transaction_date?: string;
  installment_number?: number;
  total_installments?: number;
  created_at: string;
  updated_at: string;
  // Joined data
  applications?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    property_id: string;
    total_amount: number;
  };
  profiles?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Fetch payments (admin sees all, clients see their own)
export const usePayments = (filters?: {
  status?: string;
  search?: string;
  user_id?: string;
}) => {
  const { isAdmin, user } = useAuth();
  
  return useQuery({
    queryKey: ['payments', filters, user?.id, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select(`
          *,
          applications (
            id,
            first_name,
            last_name,
            email,
            property_id,
            total_amount
          ),
          profiles!payments_verified_by_fkey (
            id,
            first_name,
            last_name,
            email
          )
        `);

      // If not admin, only show user's own payments
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
        query = query.or(`payment_reference.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch payments: ${error.message}`);
      }

      return data as unknown as Payment[];
    },
    enabled: !!user,
  });
};

// Fetch single payment by ID
export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          applications (
            id,
            first_name,
            last_name,
            email,
            property_id,
            total_amount
          ),
          profiles!payments_verified_by_fkey (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch payment: ${error.message}`);
      }

      return data as unknown as Payment;
    },
    enabled: !!id,
  });
};

// Create payment
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          ...paymentData,
          status: 'pending' as const,
          transaction_date: new Date().toISOString(),
        } as any])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create payment: ${error.message}`);
      }

      // Create notification for admin
      await supabase.from('notifications').insert([{
        user_id: paymentData.user_id,
        title: 'New Payment Submitted',
        message: `Payment of ₦${paymentData.amount.toLocaleString()} submitted for verification`,
        type: 'info',
      }]);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: "Success",
        description: "Payment submitted successfully! It will be verified by admin soon.",
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

// Verify payment (admin only)
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          verified_by: user?.id,
          verified_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to verify payment: ${error.message}`);
      }

      // Calculate payment progress
      const { data: allPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('application_id', data.application_id)
        .eq('status', 'completed');
      
      const { data: applicationData } = await supabase
        .from('applications')
        .select('total_amount')
        .eq('id', data.application_id)
        .single();

      const totalPaid = allPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const totalAmount = Number(applicationData?.total_amount || 0);
      const paymentPercentage = Math.round((totalPaid / totalAmount) * 100);
      const remainingBalance = totalAmount - totalPaid;

      // Generate appropriate documents based on payment percentage
      const documentsToGenerate = [];
      if (paymentPercentage >= 100) {
        documentsToGenerate.push('full_allocation', 'sales_agreement', 'deed_assignment');
        
        // Mark property as sold
        await supabase
          .from('properties')
          .update({ status: 'sold' })
          .eq('id', data.application_id);
      } else if (paymentPercentage >= 50) {
        documentsToGenerate.push('provisional_allocation');
      } else if (paymentPercentage > 0) {
        documentsToGenerate.push('offer_letter');
      }

      // Generate documents
      const generatedDocs = [];
      for (const docType of documentsToGenerate) {
        const docResponse = await supabase.functions.invoke('generate-documents', {
          body: { 
            applicationId: data.application_id, 
            documentType: docType,
            paymentPercentage 
          }
        });
        
        if (docResponse.data) {
          generatedDocs.push(docResponse.data);
        }
      }

      // Send payment verification email
      const emailResponse = await supabase.functions.invoke('send-application-email', {
        body: { 
          applicationId: data.application_id, 
          type: 'payment_verification',
          additionalData: {
            payment: {
              amount: data.amount,
              percentage: paymentPercentage,
              balance: remainingBalance
            },
            documents: generatedDocs
          }
        }
      });

      // Create notification for client
      const notificationMessage = paymentPercentage >= 100 
        ? `Payment verified! Your purchase is now complete. All final documents have been generated.`
        : `Payment of ₦${Number(data.amount).toLocaleString()} verified. Progress: ${paymentPercentage}%. ${generatedDocs.length > 0 ? 'New documents generated.' : ''}`;

      await supabase.from('notifications').insert([{
        user_id: data.user_id,
        title: 'Payment Verified',
        message: notificationMessage,
        type: 'success',
      }]);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['generated_documents'] });
      
      // Calculate success message based on payment progress
      const successMessage = "Payment verified successfully! Documents generated and email sent.";
      
      toast({
        title: "Success",
        description: successMessage,
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

// Reject payment (admin only)
export const useRejectPayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          notes: reason,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to reject payment: ${error.message}`);
      }

      // Create notification for client
      await supabase.from('notifications').insert([{
        user_id: data.user_id,
        title: 'Payment Rejected',
        message: `Your payment has been rejected. Reason: ${reason}`,
        type: 'error',
      }]);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: "Success",
        description: "Payment rejected successfully. Notification sent to client.",
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