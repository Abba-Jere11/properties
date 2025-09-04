import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Receipt {
  id: string;
  payment_id: string;
  amount: number;
  receipt_number: string;
  issued_date?: string;
  issued_by?: string;
  pdf_url?: string;
  created_at: string;
  // Joined data
  payments?: {
    id: string;
    user_id: string;
    application_id: string;
    amount: number;
    status: string;
    payment_reference?: string;
  };
  applications?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    property_id: string;
    estate_id: string;
  };
  profiles?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Fetch receipts (admin sees all, clients see their own)
export const useReceipts = (filters?: {
  status?: string;
  search?: string;
  user_id?: string;
}) => {
  const { isAdmin, user } = useAuth();
  
  return useQuery({
    queryKey: ['receipts', filters, user?.id, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('receipts')
        .select(`
          *,
          payments (
            id,
            user_id,
            application_id,
            amount,
            status,
            payment_reference
          ),
          profiles!receipts_issued_by_fkey (
            id,
            first_name,
            last_name,
            email
          )
        `);

      // If not admin, only show user's own receipts through payments
      if (!isAdmin && user) {
        query = query.eq('payments.user_id', user.id);
      }

      if (filters?.search) {
        query = query.or(`receipt_number.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch receipts: ${error.message}`);
      }

      return data as unknown as Receipt[];
    },
    enabled: !!user,
  });
};

// Generate receipt (admin only)
export const useGenerateReceipt = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ paymentId, amount }: { paymentId: string; amount: number }) => {
      // Generate receipt number
      const receiptNumber = `RCP${Date.now()}`;
      
      const { data, error } = await supabase
        .from('receipts')
        .insert([{
          payment_id: paymentId,
          amount,
          receipt_number: receiptNumber,
          issued_by: user?.id,
          issued_date: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to generate receipt: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast({
        title: "Success",
        description: "Receipt generated successfully",
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