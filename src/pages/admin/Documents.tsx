import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Calendar,
  User,
  Building2,
  Upload,
  CheckCircle,
  Clock
} from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [documentFilter, setDocumentFilter] = useState("all");

  const { data: documents, isLoading, error } = useDocuments({
    document_type: documentFilter === "all" ? undefined : documentFilter,
  });

  const documentTypes = [
    "Application Form",
    "Offer Letter", 
    "Provisional Allocation Letter",
    "Full Allocation Pack",
    "Sales Agreement",
    "Deed of Assignment",
    "Certificate of Occupancy"
  ];

  const getDocumentTypeColor = (type: string) => {
    const colors = {
      "Application Form": "bg-blue-100 text-blue-800",
      "Offer Letter": "bg-green-100 text-green-800", 
      "Provisional Allocation Letter": "bg-yellow-100 text-yellow-800",
      "Full Allocation Pack": "bg-purple-100 text-purple-800",
      "Sales Agreement": "bg-orange-100 text-orange-800",
      "Deed of Assignment": "bg-red-100 text-red-800",
      "Certificate of Occupancy": "bg-teal-100 text-teal-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documents & Records</h1>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents & Records</h1>
          <p className="text-red-600">Error loading documents. Please try again.</p>
        </div>
      </div>
    );
  }

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.document_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  // Group documents by application/user
  const documentsByClient = filteredDocuments.reduce((acc, doc) => {
    const key = `${doc.application_id || 'general'}_${doc.user_id}`;
    if (!acc[key]) {
      acc[key] = {
        applicationId: doc.application_id || 'N/A',
        userId: doc.user_id,
        documents: []
      };
    }
    acc[key].documents.push(doc);
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents & Records</h1>
          <p className="text-muted-foreground">Central repository of all generated documents</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload CofO
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{documents?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{documents?.filter(d => d.document_type === 'contract').length || 0}</p>
                <p className="text-sm text-muted-foreground">Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{documents?.filter(d => d.document_type === 'receipt').length || 0}</p>
                <p className="text-sm text-muted-foreground">Receipts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{documents?.filter(d => new Date(d.uploaded_at).toDateString() === new Date().toDateString()).length || 0}</p>
                <p className="text-sm text-muted-foreground">Uploaded Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={documentFilter === "all" ? "default" : "outline"}
                onClick={() => setDocumentFilter("all")}
                size="sm"
              >
                All
              </Button>
              {documentTypes.map((type) => (
                <Button 
                  key={type}
                  variant={documentFilter === type ? "default" : "outline"}
                  onClick={() => setDocumentFilter(type)}
                  size="sm"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents by Client */}
      <div className="space-y-4">
        {Object.values(documentsByClient).map((clientData: any) => (
          <Card key={`${clientData.applicationId}_${clientData.userId}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    User {clientData.userId.slice(0, 8)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Application: {clientData.applicationId}
                  </p>
                </div>
                <Badge variant="outline">
                  {clientData.documents.length} Documents
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Type</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>File Size</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientData.documents.map((doc: any) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <Badge className={getDocumentTypeColor(doc.document_type)}>
                            {doc.document_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{doc.file_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(1)} MB` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download
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
        ))}
      </div>

      {/* Document Generation Info */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="font-medium text-purple-900 mb-2">Document Generation Workflow</h3>
          <div className="text-sm text-purple-800 space-y-1">
            <p>• <strong>Application Form:</strong> Generated when application is submitted</p>
            <p>• <strong>Offer Letter:</strong> Auto-generated when first payment receipt is approved</p>
            <p>• <strong>Provisional Allocation:</strong> Generated when ≥50% payment is confirmed</p>
            <p>• <strong>Full Allocation Pack:</strong> Generated when 100% payment is completed</p>
            <p>• <strong>Sales Agreement & Deed:</strong> Part of the full allocation pack</p>
            <p>• <strong>Certificate of Occupancy:</strong> Manually uploaded when estate development is complete</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDocumentsPage;