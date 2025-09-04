-- Fix the receipts table foreign key relationship issue
-- Add missing created_at timestamp
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add foreign key constraint to ensure receipts are linked to payments properly
ALTER TABLE receipts ADD CONSTRAINT receipts_payment_id_fkey 
FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE;

-- Add foreign key constraint for issued_by to link to profiles
ALTER TABLE receipts ADD CONSTRAINT receipts_issued_by_fkey 
FOREIGN KEY (issued_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- Create document generation system tables
CREATE TABLE IF NOT EXISTS document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  template_type TEXT NOT NULL, -- 'offer_letter', 'provisional_allocation', 'full_allocation', 'sales_agreement', 'deed_assignment'
  template_content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create generated documents table
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payment_percentage NUMERIC NOT NULL DEFAULT 0
);

-- Enable RLS on new tables
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for document_templates
CREATE POLICY "Admins can manage document templates" ON document_templates
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS policies for generated_documents
CREATE POLICY "Users can view own generated documents" ON generated_documents
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM applications 
    WHERE applications.id = generated_documents.application_id 
    AND applications.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all generated documents" ON generated_documents
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Add update trigger for document_templates
CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON document_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default document templates
INSERT INTO document_templates (name, template_type, template_content) VALUES
('Offer Letter', 'offer_letter', 'Your offer letter content template here...'),
('Provisional Allocation Letter', 'provisional_allocation', 'Your provisional allocation letter content template here...'),
('Full Allocation Letter', 'full_allocation', 'Your full allocation letter content template here...'),
('Sales Agreement', 'sales_agreement', 'Your sales agreement content template here...'),
('Deed of Assignment', 'deed_assignment', 'Your deed of assignment content template here...')
ON CONFLICT (name) DO NOTHING;