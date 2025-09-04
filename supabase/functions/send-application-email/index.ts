import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  applicationId: string;
  type: 'confirmation' | 'approval' | 'payment_verification';
  additionalData?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { applicationId, type, additionalData }: EmailRequest = await req.json();
    
    console.log(`Processing email for application ${applicationId}, type: ${type}`);

    // Fetch application details with related data
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        profiles!applications_user_id_fkey(email, first_name, last_name),
        properties(title, price),
        estates(name, bank_name, account_name, account_number)
      `)
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      throw new Error(`Failed to fetch application: ${appError?.message}`);
    }

    const userEmail = application.profiles.email;
    const userName = `${application.profiles.first_name} ${application.profiles.last_name}`;
    
    let emailResponse;

    switch (type) {
      case 'confirmation':
        emailResponse = await resend.emails.send({
          from: 'Thinklab Real Estate <noreply@resend.dev>',
          to: [userEmail],
          subject: 'Application Submitted Successfully',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Application Submitted Successfully</h2>
              <p>Dear ${userName},</p>
              <p>Thank you for submitting your application for <strong>${application.properties.title}</strong> at <strong>${application.estates.name}</strong>.</p>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Application Details:</h3>
                <p><strong>Property:</strong> ${application.properties.title}</p>
                <p><strong>Estate:</strong> ${application.estates.name}</p>
                <p><strong>Total Amount:</strong> ₦${Number(application.total_amount).toLocaleString()}</p>
                <p><strong>Payment Plan:</strong> ${application.payment_plan}</p>
                <p><strong>Status:</strong> Pending Review</p>
              </div>
              
              <p>Your application is now under review. We will notify you once it has been processed.</p>
              <p>Best regards,<br>Thinklab Real Estate Team</p>
            </div>
          `,
        });
        break;

      case 'approval':
        const loginCredentials = additionalData?.credentials;
        emailResponse = await resend.emails.send({
          from: 'Thinklab Real Estate <noreply@resend.dev>',
          to: [userEmail],
          subject: 'Application Approved - Access Your Dashboard',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #22c55e;">Application Approved! 🎉</h2>
              <p>Dear ${userName},</p>
              <p>Congratulations! Your application for <strong>${application.properties.title}</strong> has been approved.</p>
              
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                <h3>Your Dashboard Access:</h3>
                <p><strong>Login URL:</strong> <a href="${additionalData?.dashboardUrl}">Access Dashboard</a></p>
                <p><strong>Email:</strong> ${userEmail}</p>
              </div>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Payment Information:</h3>
                <p><strong>Bank Name:</strong> ${application.estates.bank_name}</p>
                <p><strong>Account Name:</strong> ${application.estates.account_name}</p>
                <p><strong>Account Number:</strong> ${application.estates.account_number}</p>
                <p><strong>Total Amount:</strong> ₦${Number(application.total_amount).toLocaleString()}</p>
              </div>
              
              <p>Please proceed with your payment and upload the receipt in your dashboard.</p>
              <p>Best regards,<br>Thinklab Real Estate Team</p>
            </div>
          `,
        });
        break;

      case 'payment_verification':
        const paymentData = additionalData?.payment;
        const documents = additionalData?.documents || [];
        
        emailResponse = await resend.emails.send({
          from: 'Thinklab Real Estate <noreply@resend.dev>',
          to: [userEmail],
          subject: 'Payment Verified - Documents Generated',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #22c55e;">Payment Verified Successfully! ✅</h2>
              <p>Dear ${userName},</p>
              <p>Your payment of <strong>₦${Number(paymentData.amount).toLocaleString()}</strong> has been verified.</p>
              
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Payment Summary:</h3>
                <p><strong>Amount Paid:</strong> ₦${Number(paymentData.amount).toLocaleString()}</p>
                <p><strong>Payment Progress:</strong> ${paymentData.percentage}%</p>
                <p><strong>Remaining Balance:</strong> ₦${Number(paymentData.balance).toLocaleString()}</p>
              </div>
              
              ${documents.length > 0 ? `
              <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Generated Documents:</h3>
                ${documents.map((doc: any) => `
                  <p>📄 <strong>${doc.document_type}</strong> - Available in your dashboard</p>
                `).join('')}
              </div>
              ` : ''}
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Next Payment Information:</h3>
                <p><strong>Bank Name:</strong> ${application.estates.bank_name}</p>
                <p><strong>Account Name:</strong> ${application.estates.account_name}</p>
                <p><strong>Account Number:</strong> ${application.estates.account_number}</p>
              </div>
              
              <p>You can view all documents and make additional payments in your dashboard.</p>
              <p>Best regards,<br>Thinklab Real Estate Team</p>
            </div>
          `,
        });
        break;
    }

    // Log email sending
    await supabase.from('email_logs').insert({
      recipient_email: userEmail,
      subject: emailResponse.data?.id ? 'Email sent successfully' : 'Email failed',
      template_name: type,
      status: emailResponse.error ? 'failed' : 'sent'
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-application-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});