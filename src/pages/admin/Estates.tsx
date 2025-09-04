import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Home,
  Upload,
  Download
} from "lucide-react";

const EstatesPage = () => {
  const [selectedEstate, setSelectedEstate] = useState("bakassi");

  const estates = [
    {
      id: "bakassi",
      name: "Bakassi Estate",
      subtitle: "Bakassi GRA",
      totalUnits: 50,
      soldUnits: 28,
      availableUnits: 22,
      bankAccount: "0512044944",
      streets: ["Street A", "Street B", "Street C", "Street D"]
    },
    {
      id: "teachers",
      name: "Teachers Village",
      subtitle: "Educational Community",
      totalUnits: 30,
      soldUnits: 15,
      availableUnits: 15,
      bankAccount: "0512045099",
      streets: ["Street 1", "Street 2", "Street 3"]
    }
  ];

  const units = [
    {
      id: "U001",
      estate: "Bakassi Estate",
      street: "Street A",
      houseNumber: "12",
      bedrooms: 2,
      bathrooms: 3,
      price: 40000000,
      status: "Available",
      features: ["2 Bedrooms", "2 Sitting Rooms", "Kitchen", "3 Toilets"]
    },
    {
      id: "U002", 
      estate: "Bakassi Estate",
      street: "Street A",
      houseNumber: "13",
      bedrooms: 2,
      bathrooms: 3,
      price: 40000000,
      status: "Sold",
      features: ["2 Bedrooms", "2 Sitting Rooms", "Kitchen", "3 Toilets"],
      linkedApplication: "APP001"
    },
    {
      id: "U003",
      estate: "Teachers Village", 
      street: "Street 1",
      houseNumber: "5",
      bedrooms: 2,
      bathrooms: 3,
      price: 40000000,
      status: "Available",
      features: ["2 Bedrooms", "2 Sitting Rooms", "Kitchen", "3 Toilets"]
    },
    {
      id: "U004",
      estate: "Teachers Village",
      street: "Street 1", 
      houseNumber: "6",
      bedrooms: 2,
      bathrooms: 3,
      price: 40000000,
      status: "Pending Payment",
      features: ["2 Bedrooms", "2 Sitting Rooms", "Kitchen", "3 Toilets"],
      linkedApplication: "APP003"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-success text-success-foreground">🟢 Available</Badge>;
      case "Sold":
        return <Badge className="bg-destructive text-destructive-foreground">🔴 Sold</Badge>;
      case "Pending Payment":
        return <Badge className="bg-yellow-100 text-yellow-800">⚪ Pending Payment</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const selectedEstateData = estates.find(e => e.id === selectedEstate);
  const filteredUnits = units.filter(unit => 
    selectedEstateData ? unit.estate === selectedEstateData.name : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estate & Unit Management</h1>
          <p className="text-muted-foreground">Manage estates, streets, and individual units</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Import Units</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to add multiple units at once
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input id="csv-file" type="file" accept=".csv" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>CSV should include: Estate, Street, House Number, Bedrooms, Bathrooms, Price</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Download Template</Button>
                  <Button>Import Units</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Unit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Unit</DialogTitle>
                <DialogDescription>
                  Create a new property unit
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="unit-estate">Estate</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select estate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bakassi">Bakassi Estate</SelectItem>
                      <SelectItem value="teachers">Teachers Village</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="unit-street">Street</Label>
                  <Input id="unit-street" placeholder="Street name" />
                </div>
                <div>
                  <Label htmlFor="unit-house">House Number</Label>
                  <Input id="unit-house" placeholder="House number" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unit-bedrooms">Bedrooms</Label>
                    <Input id="unit-bedrooms" type="number" defaultValue="2" />
                  </div>
                  <div>
                    <Label htmlFor="unit-bathrooms">Bathrooms</Label>
                    <Input id="unit-bathrooms" type="number" defaultValue="3" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="unit-price">Price (₦)</Label>
                  <Input id="unit-price" type="number" defaultValue="40000000" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Add Unit</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estate Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {estates.map((estate) => (
          <Card key={estate.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-primary" />
                  {estate.name}
                </div>
                <Badge variant="secondary">{estate.subtitle}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">{estate.totalUnits}</p>
                  <p className="text-sm text-muted-foreground">Total Units</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{estate.soldUnits}</p>
                  <p className="text-sm text-muted-foreground">Sold</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{estate.availableUnits}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Allocation Progress</span>
                  <span>{((estate.soldUnits / estate.totalUnits) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(estate.soldUnits / estate.totalUnits) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-sm">
                <p><span className="font-medium">Bank Account:</span> {estate.bankAccount}</p>
                <p><span className="font-medium">Streets:</span> {estate.streets.join(", ")}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estate Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Home className="w-5 h-5 mr-2 text-primary" />
              Unit Management
            </div>
            <Select value={selectedEstate} onValueChange={setSelectedEstate}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bakassi">Bakassi Estate</SelectItem>
                <SelectItem value="teachers">Teachers Village</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Linked Application</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{unit.street}</span>
                        </div>
                        <div className="flex items-center">
                          <Home className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">House {unit.houseNumber}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{unit.bedrooms} bed • {unit.bathrooms} bath</p>
                        <p className="text-muted-foreground">700 sqm land</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(unit.price)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(unit.status)}
                    </TableCell>
                    <TableCell>
                      {unit.linkedApplication ? (
                        <Badge variant="outline">{unit.linkedApplication}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstatesPage;