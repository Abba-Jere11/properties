import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Document {
  id: string;
  user_id: string;
  application_id?: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  document_type: 'passport' | 'id_card' | 'income_proof' | 'bank_statement' | 'receipt' | 'contract' | 'other';
  uploaded_at: string;
}

// Fetch documents (admin sees all, clients see their own)
export const useDocuments = (filters?: {
  document_type?: string;
  application_id?: string;
  user_id?: string;
}) => {
  const { isAdmin, user } = useAuth();
  
  return useQuery({
    queryKey: ['documents', filters, user?.id, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select('*');

      // If not admin, only show user's own documents
      if (!isAdmin && user) {
        query = query.eq('user_id', user.id);
      }

      // Apply filters
      if (filters?.document_type) {
        query = query.eq('document_type', filters.document_type as any);
      }
      
      if (filters?.application_id) {
        query = query.eq('application_id', filters.application_id);
      }

      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      query = query.order('uploaded_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch documents: ${error.message}`);
      }

      return data as Document[];
    },
    enabled: !!user,
  });
};

// Fetch single document by ID
export const useDocument = (id: string) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch document: ${error.message}`);
      }

      return data as Document;
    },
    enabled: !!id,
  });
};

// Upload document
export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      file, 
      documentType, 
      applicationId 
    }: { 
      file: File; 
      documentType: Document['document_type']; 
      applicationId?: string;
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Save document record
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          user_id: user.id,
          application_id: applicationId,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          document_type: documentType,
        } as any])
        .select()
        .single();

      if (error) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('documents').remove([fileName]);
        throw new Error(`Failed to save document record: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    },
  });
};

// Delete document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // First get the document to get the file path
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_url, file_name')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error(`Failed to find document: ${fetchError.message}`);
      }

      // Extract file path from URL for storage deletion
      const urlParts = document.file_url.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Get last 2 parts (user_id/filename)

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) {
        console.warn('Failed to delete file from storage:', storageError.message);
      }

      // Delete record from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete document: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
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