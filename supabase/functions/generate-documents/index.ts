import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { jsPDF } from "npm:jspdf@2.5.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentRequest {
  applicationId: string;
  documentType: 'offer_letter' | 'provisional_allocation' | 'full_allocation' | 'sales_agreement' | 'deed_assignment';
  paymentPercentage: number;
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

    const { applicationId, documentType, paymentPercentage }: DocumentRequest = await req.json();
    
    console.log(`Generating ${documentType} for application ${applicationId}, payment: ${paymentPercentage}%`);

    // Fetch application details
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        profiles!applications_user_id_fkey(email, first_name, last_name, phone, address),
        properties(title, price, bedrooms, bathrooms, description),
        estates(name, location, bank_name, account_name, account_number)
      `)
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      throw new Error(`Failed to fetch application: ${appError?.message}`);
    }

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPos = 20;

    // Generate document content based on type
    switch (documentType) {
      case 'offer_letter':
        generateOfferLetter(doc, application, paymentPercentage);
        break;
      case 'provisional_allocation':
        generateProvisionalAllocation(doc, application, paymentPercentage);
        break;
      case 'full_allocation':
        generateFullAllocation(doc, application, paymentPercentage);
        break;
      case 'sales_agreement':
        generateSalesAgreement(doc, application, paymentPercentage);
        break;
      case 'deed_assignment':
        generateDeedAssignment(doc, application, paymentPercentage);
        break;
    }

    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer');
    
    // Upload to Supabase Storage
    const fileName = `${documentType}_${applicationId}_${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
      });

    if (uploadError) {
      throw new Error(`Failed to upload document: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Store generated document record
    const { error: docError } = await supabase
      .from('generated_documents')
      .insert({
        application_id: applicationId,
        document_type: documentType,
        document_url: publicUrl,
        payment_percentage: paymentPercentage
      });

    if (docError) {
      console.error('Error storing document record:', docError);
    }

    console.log(`${documentType} generated and uploaded successfully:`, publicUrl);

    return new Response(JSON.stringify({ 
      success: true, 
      documentUrl: publicUrl,
      documentType,
      fileName 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-documents function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateOfferLetter(doc: any, application: any, paymentPercentage: number) {
  let yPos = 30;
  const pageWidth = doc.internal.pageSize.width;

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("OFFER LETTER", pageWidth / 2, yPos, { align: "center" });
  yPos += 30;

  // Date
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
  yPos += 20;

  // Recipient
  doc.text(`Dear ${application.profiles.first_name} ${application.profiles.last_name},`, 20, yPos);
  yPos += 20;

  // Body
  const bodyText = [
    `We are pleased to offer you the opportunity to purchase the property located at ${application.properties.title}, ${application.estates.name}.`,
    '',
    'PROPERTY DETAILS:',
    `Property: ${application.properties.title}`,
    `Estate: ${application.estates.name}`,
    `Location: ${application.estates.location}`,
    `Total Price: ₦${Number(application.total_amount).toLocaleString()}`,
    `Payment Plan: ${application.payment_plan}`,
    '',
    `This offer is made following your initial payment representing ${paymentPercentage}% of the total purchase price.`,
    '',
    'Please review the terms and conditions attached. This offer is valid for 30 days from the date of this letter.',
    '',
    'We look forward to completing this transaction with you.',
    '',
    'Sincerely,',
    'Thinklab Real Estate Team'
  ];

  bodyText.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 8;
  });
}

function generateProvisionalAllocation(doc: any, application: any, paymentPercentage: number) {
  let yPos = 30;
  const pageWidth = doc.internal.pageSize.width;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PROVISIONAL ALLOCATION LETTER", pageWidth / 2, yPos, { align: "center" });
  yPos += 30;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
  yPos += 20;

  const bodyText = [
    `Dear ${application.profiles.first_name} ${application.profiles.last_name},`,
    '',
    `We hereby provisionally allocate to you the property: ${application.properties.title}`,
    `Located at: ${application.estates.name}, ${application.estates.location}`,
    '',
    'PAYMENT SUMMARY:',
    `Total Purchase Price: ₦${Number(application.total_amount).toLocaleString()}`,
    `Amount Paid: ${paymentPercentage}% (₦${(Number(application.total_amount) * paymentPercentage / 100).toLocaleString()})`,
    `Balance Outstanding: ${100 - paymentPercentage}% (₦${(Number(application.total_amount) * (100 - paymentPercentage) / 100).toLocaleString()})`,
    '',
    'This provisional allocation is subject to:',
    '1. Full payment of the outstanding balance',
    '2. Compliance with all terms and conditions',
    '3. Completion of all required documentation',
    '',
    'Please continue with your payment schedule to secure full allocation.',
    '',
    'Best regards,',
    'Thinklab Real Estate Team'
  ];

  bodyText.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 8;
  });
}

function generateFullAllocation(doc: any, application: any, paymentPercentage: number) {
  let yPos = 30;
  const pageWidth = doc.internal.pageSize.width;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("FULL ALLOCATION CERTIFICATE", pageWidth / 2, yPos, { align: "center" });
  yPos += 30;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
  yPos += 20;

  const bodyText = [
    `Dear ${application.profiles.first_name} ${application.profiles.last_name},`,
    '',
    'CONGRATULATIONS!',
    '',
    `We are pleased to confirm the FULL ALLOCATION of the following property:`,
    '',
    'PROPERTY DETAILS:',
    `Property: ${application.properties.title}`,
    `Estate: ${application.estates.name}`,
    `Location: ${application.estates.location}`,
    `Total Purchase Price: ₦${Number(application.total_amount).toLocaleString()}`,
    '',
    'PAYMENT CONFIRMATION:',
    `Total Amount Paid: 100% (₦${Number(application.total_amount).toLocaleString()})`,
    `Payment Status: FULLY PAID`,
    '',
    'This certificate confirms that you have completed all payment obligations',
    'and are now the rightful owner of the above-mentioned property.',
    '',
    'The Sales Agreement and Deed of Assignment will be processed separately.',
    '',
    'Congratulations on your new property!',
    '',
    'Best regards,',
    'Thinklab Real Estate Team'
  ];

  bodyText.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 8;
  });
}

function generateSalesAgreement(doc: any, application: any, paymentPercentage: number) {
  let yPos = 30;
  const pageWidth = doc.internal.pageSize.width;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SALES AGREEMENT", pageWidth / 2, yPos, { align: "center" });
  yPos += 30;

  const bodyText = [
    'AGREEMENT OF SALE',
    '',
    `This Agreement is made this ${new Date().getDate()} day of ${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}`,
    '',
    'BETWEEN:',
    'THINKLAB REAL ESTATE (The Vendor)',
    '',
    'AND:',
    `${application.profiles.first_name} ${application.profiles.last_name} (The Purchaser)`,
    `Address: ${application.profiles.address}`,
    `Email: ${application.profiles.email}`,
    `Phone: ${application.profiles.phone}`,
    '',
    'PROPERTY DESCRIPTION:',
    `${application.properties.title}`,
    `Estate: ${application.estates.name}`,
    `Location: ${application.estates.location}`,
    '',
    'TERMS AND CONDITIONS:',
    `1. Purchase Price: ₦${Number(application.total_amount).toLocaleString()}`,
    `2. Payment Method: ${application.payment_plan}`,
    '3. The purchaser has paid the full purchase price',
    '4. The property is sold with vacant possession',
    '5. All applicable taxes and fees are the responsibility of the purchaser',
    '',
    'This agreement shall be binding upon both parties.',
    '',
    'VENDOR: ___________________ DATE: ___________',
    'THINKLAB REAL ESTATE',
    '',
    'PURCHASER: ___________________ DATE: ___________',
    `${application.profiles.first_name} ${application.profiles.last_name}`
  ];

  bodyText.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 8;
  });
}

function generateDeedAssignment(doc: any, application: any, paymentPercentage: number) {
  let yPos = 30;
  const pageWidth = doc.internal.pageSize.width;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("DEED OF ASSIGNMENT", pageWidth / 2, yPos, { align: "center" });
  yPos += 30;

  const bodyText = [
    'DEED OF ASSIGNMENT',
    '',
    `THIS DEED is made this ${new Date().getDate()} day of ${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}`,
    '',
    'BETWEEN:',
    '',
    '(1) THINKLAB REAL ESTATE, a company incorporated under the laws',
    'of the Federal Republic of Nigeria (hereinafter called "THE ASSIGNOR")',
    '',
    'AND',
    '',
    `(2) ${application.profiles.first_name.toUpperCase()} ${application.profiles.last_name.toUpperCase()}`,
    `of ${application.profiles.address}`,
    '(hereinafter called "THE ASSIGNEE")',
    '',
    'WHEREAS the Assignor is the owner of the property described below',
    'AND WHEREAS the Assignee has paid the full consideration',
    '',
    'NOW THIS DEED WITNESSETH as follows:',
    '',
    '1. In consideration of the sum of ₦' + Number(application.total_amount).toLocaleString(),
    '   paid by the Assignee (receipt whereof is hereby acknowledged)',
    '',
    '2. The Assignor hereby assigns unto the Assignee ALL THAT piece',
    '   of land described as:',
    `   ${application.properties.title}`,
    `   Situated at ${application.estates.name}, ${application.estates.location}`,
    '',
    '3. TO HOLD unto the Assignee in fee simple',
    '',
    '4. The Assignor covenants that the property is free from encumbrances',
    '',
    'IN WITNESS WHEREOF the parties have executed this deed',
    '',
    'SIGNED, SEALED AND DELIVERED',
    '',
    'THE ASSIGNOR: _________________ DATE: _________',
    'THINKLAB REAL ESTATE',
    '',
    'THE ASSIGNEE: _________________ DATE: _________',
    `${application.profiles.first_name} ${application.profiles.last_name}`,
    '',
    'WITNESSES:',
    '1. _________________ DATE: _________',
    '2. _________________ DATE: _________'
  ];

  bodyText.forEach(line => {
    doc.text(line, 20, yPos);
    yPos += 6;
  });
}