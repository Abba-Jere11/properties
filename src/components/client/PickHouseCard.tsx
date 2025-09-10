import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Home, MapPin } from 'lucide-react';

interface PickHouseCardProps {
  application: {
    id: string;
    status: string;
    estate_id?: string;
    property_id?: string;
    selected_house?: string;
    selected_street?: string;
  };
}

export const PickHouseCard = ({ application }: PickHouseCardProps) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available properties for the estate
  const { data: properties, isLoading: loadingProperties } = useQuery({
    queryKey: ['available-properties', application.estate_id],
    queryFn: async () => {
      if (!application.estate_id) return [];
      
      const { data, error } = await supabase
        .from('properties')
        .select('*, streets(name)')
        .eq('estate_id', application.estate_id)
        .eq('status', 'available')
        .order('title');

      if (error) throw error;
      return data;
    },
    enabled: !!application.estate_id,
  });

  // Mutation to select a house
  const selectHouseMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const { data, error } = await supabase.functions.invoke('select-house', {
        body: {
          application_id: application.id,
          property_id: propertyId,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['available-properties'] });
      toast({
        title: "House Selected Successfully",
        description: `You have selected ${data.property?.title}`,
      });
      setSelectedPropertyId(''); // Reset selection
    },
    onError: (error: any) => {
      console.error('Error selecting house:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to select house",
        variant: "destructive",
      });
    },
  });

  const handleSelectHouse = () => {
    if (!selectedPropertyId) {
      toast({
        title: "No Property Selected",
        description: "Please select a property",
        variant: "destructive",
      });
      return;
    }

    selectHouseMutation.mutate(selectedPropertyId);
  };

  // Don't show if application is not pending
  if (application.status !== 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            House Selection
          </CardTitle>
          <CardDescription>
            House selection is only available for pending applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {application.selected_house && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>Selected: {application.selected_house}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Pick Your House
        </CardTitle>
        <CardDescription>
          Choose from available properties in your approved estate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="property">Available Properties</Label>
          <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {loadingProperties ? (
                <SelectItem value="loading" disabled>Loading properties...</SelectItem>
              ) : properties?.length ? (
                properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    <div className="flex flex-col">
                      <span>{property.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {property.bedrooms}BR • {property.bathrooms}BA • ₦{property.price?.toLocaleString()}
                        {property.streets?.name && ` • ${property.streets.name}`}
                      </span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-properties" disabled>No properties available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedPropertyId && properties?.find(p => p.id === selectedPropertyId) && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium">
              {properties.find(p => p.id === selectedPropertyId)?.title}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {properties.find(p => p.id === selectedPropertyId)?.description}
            </div>
          </div>
        )}

        <Button 
          onClick={handleSelectHouse} 
          disabled={selectHouseMutation.isPending || !selectedPropertyId}
          className="w-full"
        >
          {selectHouseMutation.isPending ? 'Selecting...' : 'Select This Property'}
        </Button>

        {application.selected_house && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Home className="h-4 w-4" />
            <span>Current selection: {application.selected_house}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};