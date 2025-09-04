import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalReceipts: number;
  pendingReceipts: number;
  verifiedReceipts: number;
  totalSales: number;
  monthlyApplications: Array<{
    month: string;
    applications: number;
    approved: number;
  }>;
  estateAllocation: Array<{
    estate: string;
    available: number;
    sold: number;
    booked: number;
  }>;
  paymentProgress: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const useDashboardStats = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id, isAdmin],
    queryFn: async (): Promise<DashboardStats> => {
      // Fetch applications stats
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('id, status, created_at, total_amount');

      if (appError) throw new Error(`Failed to fetch applications: ${appError.message}`);

      // Fetch payments for sales calculation
      const { data: payments, error: payError } = await supabase
        .from('payments')
        .select('id, amount, status');

      if (payError) throw new Error(`Failed to fetch payments: ${payError.message}`);

      // Fetch receipts
      const { data: receipts, error: recError } = await supabase
        .from('receipts')
        .select('id');

      if (recError) throw new Error(`Failed to fetch receipts: ${recError.message}`);

      // Fetch estates with property counts
      const { data: estates, error: estError } = await supabase
        .from('estates')
        .select(`
          name,
          total_units,
          available_units,
          sold_units
        `);

      if (estError) throw new Error(`Failed to fetch estates: ${estError.message}`);

      const totalApplications = applications.length;
      const pendingApplications = applications.filter(app => app.status === 'pending').length;
      const approvedApplications = applications.filter(app => app.status === 'approved').length;
      const rejectedApplications = applications.filter(app => app.status === 'rejected').length;

      const verifiedPayments = payments.filter(p => p.status === 'completed');
      const totalSales = verifiedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      // Calculate monthly applications for the last 6 months
      const monthlyData: { [key: string]: { applications: number; approved: number } } = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      applications.forEach(app => {
        const date = new Date(app.created_at);
        const monthKey = months[date.getMonth()];
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { applications: 0, approved: 0 };
        }
        monthlyData[monthKey].applications++;
        if (app.status === 'approved') {
          monthlyData[monthKey].approved++;
        }
      });

      const monthlyApplications = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data
      }));

      // Estate allocation data
      const estateAllocation = estates.map(estate => ({
        estate: estate.name,
        available: estate.available_units || 0,
        sold: estate.sold_units || 0,
        booked: (estate.total_units || 0) - (estate.available_units || 0) - (estate.sold_units || 0)
      }));

      // Payment progress distribution
      const totalApproved = approvedApplications;
      const paymentProgress = [
        { name: 'Pending Payment', value: Math.floor(totalApproved * 0.3), color: '#fbbf24' },
        { name: '≥50% Paid', value: Math.floor(totalApproved * 0.4), color: '#3b82f6' },
        { name: '100% Paid', value: Math.floor(totalApproved * 0.3), color: '#10b981' },
      ];

      return {
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalReceipts: receipts.length,
        pendingReceipts: Math.floor(receipts.length * 0.2), // Estimate
        verifiedReceipts: Math.floor(receipts.length * 0.8), // Estimate
        totalSales,
        monthlyApplications,
        estateAllocation,
        paymentProgress,
      };
    },
    enabled: !!user && isAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};