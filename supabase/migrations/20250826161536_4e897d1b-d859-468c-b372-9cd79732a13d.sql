-- Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'agent', 'client');
CREATE TYPE public.application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'completed');
CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE public.property_status AS ENUM ('available', 'reserved', 'sold', 'under_construction');
CREATE TYPE public.payment_plan_type AS ENUM ('outright', 'installment_6', 'installment_12', 'installment_24');
CREATE TYPE public.document_type AS ENUM ('passport', 'id_card', 'receipt', 'contract', 'other');

-- 1. Users/Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role user_role DEFAULT 'client',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Estates table
CREATE TABLE public.estates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    total_units INTEGER DEFAULT 0,
    available_units INTEGER DEFAULT 0,
    sold_units INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Streets table
CREATE TABLE public.streets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_id UUID REFERENCES public.estates(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(estate_id, name)
);

-- 4. Properties table
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estate_id UUID REFERENCES public.estates(id) ON DELETE CASCADE NOT NULL,
    street_id UUID REFERENCES public.streets(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    square_feet INTEGER,
    lot_size TEXT,
    property_type TEXT,
    status property_status DEFAULT 'available',
    is_featured BOOLEAN DEFAULT false,
    images TEXT[], -- Array of image URLs
    amenities TEXT[],
    payment_plans payment_plan_type[] DEFAULT ARRAY['outright'::payment_plan_type, 'installment_6'::payment_plan_type],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Applications table
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    estate_id UUID REFERENCES public.estates(id) ON DELETE CASCADE NOT NULL,
    
    -- Client Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    occupation TEXT,
    employer TEXT,
    monthly_income DECIMAL(15,2),
    
    -- Next of Kin
    next_of_kin_name TEXT NOT NULL,
    next_of_kin_phone TEXT NOT NULL,
    next_of_kin_address TEXT NOT NULL,
    next_of_kin_relationship TEXT NOT NULL,
    
    -- Property Details
    selected_street TEXT,
    selected_house TEXT,
    payment_plan payment_plan_type NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    
    -- Application Status
    status application_status DEFAULT 'pending',
    rejection_reason TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    
    -- Terms
    terms_accepted BOOLEAN DEFAULT false,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Documents table
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_type document_type NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_reference TEXT UNIQUE,
    payment_method TEXT,
    status payment_status DEFAULT 'pending',
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    notes TEXT,
    
    -- Payment plan tracking
    installment_number INTEGER,
    total_installments INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Receipts table
CREATE TABLE public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE NOT NULL,
    receipt_number TEXT UNIQUE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    issued_by UUID REFERENCES auth.users(id),
    pdf_url TEXT
);

-- 9. Payment Schedules table
CREATE TABLE public.payment_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
    installment_number INTEGER NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    status payment_status DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_id UUID REFERENCES public.payments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. Notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Email Templates table
CREATE TABLE public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    variables TEXT[], -- Available variables for template
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 12. Email Logs table
CREATE TABLE public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_name TEXT,
    status TEXT DEFAULT 'sent',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 13. System Settings table
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 14. Audit Logs table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (public.is_admin());

-- Estates policies (public read, admin write)
CREATE POLICY "Anyone can view active estates" ON public.estates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage estates" ON public.estates
    FOR ALL USING (public.is_admin());

-- Streets policies (public read, admin write)
CREATE POLICY "Anyone can view streets" ON public.streets
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage streets" ON public.streets
    FOR ALL USING (public.is_admin());

-- Properties policies (public read, admin write)
CREATE POLICY "Anyone can view properties" ON public.properties
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage properties" ON public.properties
    FOR ALL USING (public.is_admin());

-- Applications policies
CREATE POLICY "Users can view own applications" ON public.applications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own applications" ON public.applications
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pending applications" ON public.applications
    FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can view all applications" ON public.applications
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all applications" ON public.applications
    FOR UPDATE USING (public.is_admin());

-- Documents policies
CREATE POLICY "Users can view own documents" ON public.documents
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can upload own documents" ON public.documents
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all documents" ON public.documents
    FOR SELECT USING (public.is_admin());

-- Payments policies
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own payments" ON public.payments
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all payments" ON public.payments
    FOR ALL USING (public.is_admin());

-- Receipts policies
CREATE POLICY "Users can view own receipts" ON public.receipts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.payments p 
            WHERE p.id = payment_id AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all receipts" ON public.receipts
    FOR ALL USING (public.is_admin());

-- Payment schedules policies
CREATE POLICY "Users can view own payment schedules" ON public.payment_schedules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.applications a 
            WHERE a.id = application_id AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all payment schedules" ON public.payment_schedules
    FOR ALL USING (public.is_admin());

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Email templates policies (admin only)
CREATE POLICY "Admins can manage email templates" ON public.email_templates
    FOR ALL USING (public.is_admin());

-- Email logs policies (admin only)
CREATE POLICY "Admins can view email logs" ON public.email_logs
    FOR SELECT USING (public.is_admin());

-- System settings policies (admin only)
CREATE POLICY "Admins can manage system settings" ON public.system_settings
    FOR ALL USING (public.is_admin());

-- Audit logs policies (admin only)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_estates_updated_at BEFORE UPDATE ON public.estates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create profile automatically on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_estates_active ON public.estates(is_active);
CREATE INDEX idx_streets_estate_id ON public.streets(estate_id);
CREATE INDEX idx_properties_estate_id ON public.properties(estate_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_featured ON public.properties(is_featured);
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_documents_application_id ON public.documents(application_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_payments_application_id ON public.payments(application_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);

-- Insert some initial data
INSERT INTO public.system_settings (key, value, description) VALUES
('app_name', '"Real Estate Management"', 'Application name'),
('app_version', '"1.0.0"', 'Application version'),
('max_file_size', '5242880', 'Maximum file upload size in bytes (5MB)'),
('allowed_file_types', '["image/jpeg", "image/png", "image/jpg", "application/pdf"]', 'Allowed file types for uploads');

-- Insert sample email templates
INSERT INTO public.email_templates (name, subject, body, variables) VALUES
('application_received', 'Application Received - {{property_title}}', 
 'Dear {{client_name}}, We have received your application for {{property_title}}. We will review it and get back to you soon.', 
 ARRAY['client_name', 'property_title']),
('application_approved', 'Application Approved - {{property_title}}', 
 'Congratulations {{client_name}}! Your application for {{property_title}} has been approved.', 
 ARRAY['client_name', 'property_title']),
('payment_received', 'Payment Received - Receipt #{{receipt_number}}', 
 'Dear {{client_name}}, We have received your payment of {{amount}} for {{property_title}}.', 
 ARRAY['client_name', 'property_title', 'amount', 'receipt_number']);