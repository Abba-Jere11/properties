import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ClientDashboardData {
  applications: Array<{
    id: string;
    status: string;
    total_amount: number;
    estate_name?: string;
    property_title?: string;
    selected_house?: string;
    selected_street?: string;
    payment_plan: string;
    created_at: string;
    approved_at?: string;
    estate_id?: string;
    property_id?: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    created_at: string;
    payment_reference?: string;
  }>;
  totalPaid: number;
  totalAmount: number;
  paymentProgress: number;
  recentActivity: Array<{
    date: string;
    action: string;
    description: string;
    status: string;
    icon: string;
  }>;
  nextPaymentDue?: string;
  documents: Array<{
    id: string;
    document_type: string;
    file_name: string;
    uploaded_at: string;
  }>;
}

export const useClientDashboard = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['client-dashboard', user?.id],
    queryFn: async (): Promise<ClientDashboardData> => {
      if (!user) throw new Error('User not authenticated');

      // Fetch user's applications with related data
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select(`
          *,
          estates (name),
          properties (title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (appError) throw new Error(`Failed to fetch applications: ${appError.message}`);

      // Fetch user's payments
      const { data: payments, error: payError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (payError) throw new Error(`Failed to fetch payments: ${payError.message}`);

      // Fetch user's documents
      const { data: documents, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (docError) throw new Error(`Failed to fetch documents: ${docError.message}`);

      const totalPaid = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const totalAmount = applications.reduce((sum, app) => sum + (app.total_amount || 0), 0);
      const paymentProgress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

      // Generate recent activity from applications, payments, and documents
      const recentActivity = [
        ...applications.map(app => ({
          date: app.created_at,
          action: `Application ${app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Submitted'}`,
          description: `Property application ${app.status === 'approved' ? 'has been approved' : app.status === 'rejected' ? 'was rejected' : 'submitted successfully'}`,
          status: app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'error' : 'pending',
          icon: app.status === 'approved' ? 'CheckCircle' : app.status === 'rejected' ? 'XCircle' : 'FileText'
        })),
        ...payments.map(payment => ({
          date: payment.created_at,
          action: 'Payment Submitted',
          description: `Payment of ₦${payment.amount?.toLocaleString()} ${payment.status === 'completed' ? 'verified' : 'submitted for verification'}`,
          status: payment.status === 'completed' ? 'success' : 'pending',
          icon: payment.status === 'completed' ? 'CheckCircle' : 'Upload'
        })),
        ...documents.map(doc => ({
          date: doc.uploaded_at,
          action: 'Document Uploaded',
          description: `${doc.document_type} document uploaded`,
          status: 'success',
          icon: 'FileText'
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      return {
        applications: applications.map(app => ({
          id: app.id,
          status: app.status,
          total_amount: app.total_amount,
          estate_name: app.estates?.name,
          property_title: app.properties?.title,
          selected_house: app.selected_house,
          selected_street: app.selected_street,
          payment_plan: app.payment_plan,
          created_at: app.created_at,
          approved_at: app.approved_at,
          estate_id: app.estate_id,
          property_id: app.property_id,
        })),
        payments: payments.map(p => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          created_at: p.created_at,
          payment_reference: p.payment_reference,
        })),
        totalPaid,
        totalAmount,
        paymentProgress,
        recentActivity,
        documents: documents.map(d => ({
          id: d.id,
          document_type: d.document_type,
          file_name: d.file_name,
          uploaded_at: d.uploaded_at,
        })),
        nextPaymentDue: undefined // Will be calculated based on payment schedule
      };
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};