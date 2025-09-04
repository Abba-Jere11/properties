import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, MapPin, Home, Upload, X, User } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateApplication } from "@/hooks/useApplications";
import { useAuth } from "@/contexts/AuthContext";
import { useEstates, useStreets } from "@/hooks/useEstates";
import { useProperties } from "@/hooks/useProperties";

interface FormData {
  // Section A - Client Information
  surname: string;
  middleName: string;
  firstName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  alternativePhone: string;
  address: string;
  modeOfIdentification: string;
  idNumber: string;
  email: string;
  bvn: string;
  sourceOfIncome: string;
  estimatedAnnualIncome: string;
  howDidYouHear: string;
  agentName: string;
  agentPhone: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;
  nextOfKinAddress: string;
  passportImage: File | null;
  
  // Section B - Estate Selection
  selectedEstate: string;
  selectedStreet: string;
  selectedHouse: string;
  numberOfUnits: string;
  paymentOption: string;
  paymentPlanDuration: string;
  stateInstallment: string;
  
  // Terms acceptance
  termsAccepted: boolean;
  signature: string;
}

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    surname: '',
    middleName: '',
    firstName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    alternativePhone: '',
    address: '',
    modeOfIdentification: '',
    idNumber: '',
    email: '',
    bvn: '',
    sourceOfIncome: '',
    estimatedAnnualIncome: '',
    howDidYouHear: '',
    agentName: '',
    agentPhone: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinRelationship: '',
    nextOfKinAddress: '',
    passportImage: null,
    selectedEstate: '',
    selectedStreet: '',
    selectedHouse: '',
    numberOfUnits: '',
    paymentOption: '',
    paymentPlanDuration: '',
    stateInstallment: '',
    termsAccepted: false,
    signature: ''
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');

  const { user } = useAuth();
  const { data: estatesData = [] } = useEstates(true);
  const { data: streetsData = [] } = useStreets(formData.selectedEstate);
  const { data: propertiesData = [] } = useProperties(formData.selectedEstate ? { estate_id: formData.selectedEstate } : undefined as any);
  const createApplication = useCreateApplication();

  const selectedEstate = estatesData.find(e => e.id === formData.selectedEstate);
  const availableHouses = formData.selectedStreet ? 
    Array.from({length: 20}, (_, i) => `House ${i + 1}`) : [];

  const progress = (currentStep / 4) * 100;

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePassportUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setFormData(prev => ({ ...prev, passportImage: file }));
    toast.success('Passport image uploaded successfully');
  };

  const removePassportImage = () => {
    setFormData(prev => ({ ...prev, passportImage: null }));
    // Reset the file input
    const fileInput = document.getElementById('passport-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    // if (!user) {   
    //   toast.error('Please log in to submit an application');
    //   return;
    // }
    // if (!formData.selectedEstate || !selectedPropertyId || !formData.selectedStreet ) {
    //   toast.error('Please complete estate, property, street and house selections');
    //   return;
    // }

    const property = propertiesData.find(p => p.id === selectedPropertyId);
    if (!property) {
      toast.error('Invalid property selected');
      return;
    }

    const units = Math.max(1, parseInt(formData.numberOfUnits || '1', 10));
    const totalAmount = Number(property.price) * units;

    try {
      await createApplication.mutateAsync({
        user_id: user ? user.id : null,
        property_id: property.id,
        estate_id: formData.selectedEstate,
        first_name: formData.firstName,
        last_name: formData.surname,
        email: formData.email,
        phone: formData.phoneNumber,
        address: formData.address,
        occupation: formData.sourceOfIncome,
        employer: formData.agentName || null as any,
        monthly_income: formData.estimatedAnnualIncome ? Number(formData.estimatedAnnualIncome) : null as any,
        next_of_kin_name: formData.nextOfKinName,
        next_of_kin_phone: formData.nextOfKinPhone,
        next_of_kin_relationship: formData.nextOfKinRelationship,
        next_of_kin_address: formData.nextOfKinAddress,
        // selected_house: formData.selectedHouse,
        // selected_street: formData.selectedStreet,
        payment_plan: (formData.paymentOption === 'outright' ? 'outright' : 'installment_6') as any,
        total_amount: totalAmount,
        terms_accepted: formData.termsAccepted,
      } as any);

      // Reset form
      setFormData({
        surname: '', middleName: '', firstName: '', dateOfBirth: '', gender: '',
        phoneNumber: '', alternativePhone: '', address: '', modeOfIdentification: '',
        idNumber: '', email: '', bvn: '', sourceOfIncome: '', estimatedAnnualIncome: '',
        howDidYouHear: '', agentName: '', agentPhone: '', nextOfKinName: '',
        nextOfKinPhone: '', nextOfKinRelationship: '', nextOfKinAddress: '',
        passportImage: null,
        
        selectedEstate: '', 
        selectedStreet: '', 
        selectedHouse: '', 

        numberOfUnits: '',
        paymentOption: '', paymentPlanDuration: '', stateInstallment: '',
        termsAccepted: false, signature: ''
      });
      setSelectedPropertyId('');
      setCurrentStep(1);
    } catch (e: any) {
      toast.error(e.message || 'Failed to submit application');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Section A: Client Information</h2>
        
        {/* Passport Image Upload */}
        <div className="mx-auto">
          <Label className="block text-sm font-medium mb-2">Client Passport Photo *</Label>
          {!formData.passportImage ? (
            <div className="relative">
              <input
                id="passport-upload"
                type="file"
                accept="image/*"
                onChange={handlePassportUpload}
                className="hidden"
              />
              <label
                htmlFor="passport-upload"
                className="w-32 h-32 border-2 border-dashed border-muted-foreground rounded-lg mx-auto flex flex-col items-center justify-center text-sm text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors"
              >
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-center">Click to upload passport photo</span>
                <span className="text-xs text-muted-foreground mt-1">Max 5MB</span>
              </label>
            </div>
          ) : (
            <div className="relative mx-auto w-32 h-32">
              <img
                src={URL.createObjectURL(formData.passportImage)}
                alt="Passport"
                className="w-32 h-32 object-cover rounded-lg border-2 border-primary"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removePassportImage}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="mt-2 flex items-center justify-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Uploaded</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="surname">Surname *</Label>
          <Input
            id="surname"
            value={formData.surname}
            onChange={(e) => updateFormData('surname', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName}
            onChange={(e) => updateFormData('middleName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Gender *</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => updateFormData('gender', value)}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="alternativePhone">Alternative Phone Number</Label>
          <Input
            id="alternativePhone"
            value={formData.alternativePhone}
            onChange={(e) => updateFormData('alternativePhone', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Mode of Identification *</Label>
        <RadioGroup
          value={formData.modeOfIdentification}
          onValueChange={(value) => updateFormData('modeOfIdentification', value)}
          className="flex gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="national-id" id="national-id" />
            <Label htmlFor="national-id">National ID Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="international-passport" id="international-passport" />
            <Label htmlFor="international-passport">International Passport</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="drivers-license" id="drivers-license" />
            <Label htmlFor="drivers-license">Driver's License</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="idNumber">ID Number *</Label>
          <Input
            id="idNumber"
            value={formData.idNumber}
            onChange={(e) => updateFormData('idNumber', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bvn">BVN *</Label>
          <Input
            id="bvn"
            value={formData.bvn}
            onChange={(e) => updateFormData('bvn', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="sourceOfIncome">Source of Income *</Label>
          <Input
            id="sourceOfIncome"
            value={formData.sourceOfIncome}
            onChange={(e) => updateFormData('sourceOfIncome', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="estimatedAnnualIncome">Estimated Annual Income</Label>
        <Input
          id="estimatedAnnualIncome"
          value={formData.estimatedAnnualIncome}
          onChange={(e) => updateFormData('estimatedAnnualIncome', e.target.value)}
        />
      </div>

      <div>
        <Label>How did you hear about us?</Label>
        <RadioGroup
          value={formData.howDidYouHear}
          onValueChange={(value) => updateFormData('howDidYouHear', value)}
          className="grid grid-cols-2 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="social-media" id="social-media" />
            <Label htmlFor="social-media">Social Media: Instagram, Facebook, Twitter</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="website" id="website" />
            <Label htmlFor="website">Website</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="publication" id="publication" />
            <Label htmlFor="publication">Publication: Newspaper, Newsletter, flyers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="agent" id="agent" />
            <Label htmlFor="agent">Agent</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.howDidYouHear === 'agent' && (
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-4">If Agent: Fill the information below:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agentName">Name</Label>
              <Input
                id="agentName"
                value={formData.agentName}
                onChange={(e) => updateFormData('agentName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="agentPhone">Phone Number</Label>
              <Input
                id="agentPhone"
                value={formData.agentPhone}
                onChange={(e) => updateFormData('agentPhone', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Next of Kin Details</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nextOfKinName">Name *</Label>
            <Input
              id="nextOfKinName"
              value={formData.nextOfKinName}
              onChange={(e) => updateFormData('nextOfKinName', e.target.value)}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nextOfKinPhone">Phone Number *</Label>
              <Input
                id="nextOfKinPhone"
                value={formData.nextOfKinPhone}
                onChange={(e) => updateFormData('nextOfKinPhone', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="nextOfKinRelationship">Relationship *</Label>
              <Input
                id="nextOfKinRelationship"
                value={formData.nextOfKinRelationship}
                onChange={(e) => updateFormData('nextOfKinRelationship', e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="nextOfKinAddress">Address *</Label>
            <Textarea
              id="nextOfKinAddress"
              value={formData.nextOfKinAddress}
              onChange={(e) => updateFormData('nextOfKinAddress', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Section B: Select Estate</h2>
      </div> */}

      {/* <div>
        <Label>Select Estate *</Label>
        <RadioGroup
          value={formData.selectedEstate}
          onValueChange={(value) => {
            updateFormData('selectedEstate', value);
            updateFormData('selectedStreet', '');
            updateFormData('selectedHouse', '');
          }}
          className="mt-2 space-y-4"
        >
          {estatesData.map((estate) => (
            <div key={estate.id} className="flex items-center space-x-2">
              <RadioGroupItem value={estate.id} id={estate.id} />
              <Label htmlFor={estate.id} className="flex-1">
                {estate.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div> */}

      {/* {selectedEstate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {selectedEstate.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="">
              <div>
                <img
                  src={
                    selectedEstate.name === "Bakassi Estate"
                      ? "/bakasiL.png"
                      : selectedEstate.name === "Teachers Village"
                        ? "TeachersL.png"
                        : "/public/placeholder.svg"
                  }
                  alt={selectedEstate.name}
                  className="w-full h-full object-cover rounded-lg"
  />
              </div>
              <div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedEstate && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="selectedStreet">Select Street/Block *</Label>
              <Select
                value={formData.selectedStreet}
                onValueChange={(value) => {
                  updateFormData('selectedStreet', value);
                  updateFormData('selectedHouse', '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose street..." />
                </SelectTrigger>
                <SelectContent>
                  {streetsData.map((street) => (
                    <SelectItem key={street.id} value={street.name}>
                      {street.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="selectedHouse">Select House Number *</Label>
              <Select
                value={formData.selectedHouse}
                onValueChange={(value) => updateFormData('selectedHouse', value)}
                disabled={!formData.selectedStreet}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose house..." />
                </SelectTrigger>
                <SelectContent>
                  {availableHouses.map((house) => (
                    <SelectItem key={house} value={house}>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        {house}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
                </Select>
              </div>
            </div>

            <div> 

              <Label htmlFor="selectedProperty">Select Property *</Label>
              <Select
                value={selectedPropertyId}
                onValueChange={(value) => setSelectedPropertyId(value)}
                disabled={!formData.selectedEstate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose property..." />
                </SelectTrigger>
                <SelectContent>
                  {propertiesData.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title} - ₦{new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(property.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
        </>
      )} */}

      <div>
        <Label htmlFor="numberOfUnits">No. of Units To Be Purchase *</Label>
        <Input
          id="numberOfUnits"
          type="number"
          min="1"
          value={formData.numberOfUnits}
          onChange={(e) => updateFormData('numberOfUnits', e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Payment Options *</Label>
        <RadioGroup
          value={formData.paymentOption}
          onValueChange={(value) => updateFormData('paymentOption', value)}
          className="mt-2 space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="outright" id="outright" />
            <Label htmlFor="Outright">
              <div>
                <div className="font-semibold">Outright Purchase</div>
                <div className="text-sm text-muted-foreground">
                  (Minimum 50% Down Payment and the rest to be paid over a period not exceeding 60 Days)
                  Outright Purchase
                  Buyer pays the full property price at once.
                  Immediate ownership transfer.
                  No long-term obligations.
                  <br/>
                  ✅ Best for those who want full ownership right away.
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="musharakah" id="musharakah" />
            <Label htmlFor="Mushtarakah">
              <div>
                <div className="font-semibold">Musharakah Purchase Plan</div>
                <div className="text-sm text-muted-foreground">
                  (This is a Co-ownership Partnership Purchase provided by our financing partner. Fulus Capital is a Sharia-compliant)
                  We buy the property and sell it to you at an agreed profit.
                  You don’t have to pay everything at once — instead, you pay in fixed installments over a set period, making it easier to manage.
                  <br/>
                  ✅ Best for investors who want shared returns before complete ownership.
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="murabahah" id="murabahah" />
            <Label htmlFor="Murabahah">
              <div>
                <div className="font-semibold">Murabahah Purchase Plan</div>
                <div className="text-sm text-muted-foreground">
                  
                  Murabahah (Cost-Plus Sale)
                  We buy the property and sell it to you at an agreed profit. 
                  You don’t have to pay everything at once — instead, you pay in fixed installments over a set period, making it easier to manage.
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ijarah" id="ijarah" />
            <Label htmlFor="Ijarah">
              <div>
                <div className="font-semibold">Ijarah Purchase Plan</div>
                <div className="text-sm text-muted-foreground">
                  
                  You rent the property for an agreed time with fixed payments.
                  Once the lease period ends and all payments are complete, the property ownership is fully transferred to you.
                  It’s renting today with guaranteed ownership tomorrow.
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

     {['musharakah', 'murabahah', 'ijarah', 'outright'].includes(formData.paymentOption) && (
  <div className="bg-muted p-4 rounded-lg">
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="paymentPlanDuration">State Payment Plan Duration</Label>
        <Input
          id="paymentPlanDuration"
          value={formData.paymentPlanDuration}
          onChange={(e) => updateFormData('paymentPlanDuration', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="stateInstallment">State Installment(s)</Label>
        <Input
          id="stateInstallment"
          value={formData.stateInstallment}
          onChange={(e) => updateFormData('stateInstallment', e.target.value)}
        />
      </div>
    </div>
  </div>
)}

    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Section C: Terms and Conditions</h2>
      </div>

       


      <Card>
        <CardHeader>
          <CardTitle>Purchase Transaction Terms and Conditions:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>1. This form is free and does not guarantee ownership of a property. It should not be used as a title document.</p>
          <p>2. Payment will be made using the payment method specified.</p>
          <p>3. Payments should be made to the Thinklab Properties Limited account mentioned in this form. Thinklab is not liable for any payments made to the wrong account other than the one specified.</p>
          <p>4. An offer letter will be issued once the buyer completes this form, selects a suitable unit, inspects the property and Pays 5% of the purchase amount.</p>
          <p>5. A provisional allocation letter will be issued when the buyer makes at least 50% of the purchase amount.</p>
          <p>6. A full allocation letter, sales agreement, and Deed of Assignment will be issued when the buyer pays 100% of the purchase price.</p>
          <p>7. In the case of a default, deposits will be refundable, minus a 5% administrative fee of the amount paid.</p>
          <p>8. Withdrawal of paid amount is not negotiable and attractable of 2.5% of the purchase price.</p>
          <p>9. Any local taxes and levies will be the responsibility of the buyer.</p>
          <p>10. All payments should be made to the approved accounts mentioned. Thinklab properties will not be liable for any payment made to any other 3rd party or unapproved account.</p>
          <p>11. You should also include that he buyer is responsible for all charges and fees related to title perfection.</p>
          <p>12. An introduction letter would be given with the deed of assignment to the buyer to enable them to process the title with the Borno State Geographical Information System (BOGIS).</p>
        </CardContent>
      </Card>

      <div>
        <Label>Conclusion</Label>
        <p className="text-sm text-muted-foreground mt-2">
          Please carefully review and ensure that all information provided on this form is accurate and complete. Any inaccuracies or omissions will be held by us as delays or issues in processing. Thinklab Properties Limited will not be held liable for any consequences resulting from incorrect or misleading information submitted on this form. Thank you for your attention to detail.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="signature">Name</Label>
          <Input
            id="signature"
            value={formData.signature}
            onChange={(e) => updateFormData('signature', e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>
        <div>
          <Label>Sign/Date</Label>
          <Input
            value={new Date().toLocaleDateString()}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => updateFormData('termsAccepted', !!checked)}
        />
        <Label htmlFor="terms" className="text-sm">
          I have read, understood, and agree to all the terms and conditions stated above.
        </Label>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Review Application</h2>
        <p className="text-muted-foreground">Please review your information before submitting</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Full Name:</strong> {formData.surname} {formData.middleName} {formData.firstName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phoneNumber}</p>
            <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            
            <p><strong>Mode of Identification:</strong> {formData.modeOfIdentification}</p>
            <p><strong>Id Number:</strong> {formData.idNumber}</p>
            <p><strong>BVN:</strong> {formData.bvn}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Estate:</strong> {selectedEstate?.name}</p>
            <p><strong>Street:</strong> {formData.selectedStreet}</p>
            <p><strong>House:</strong> {formData.selectedHouse}</p>
            <p><strong>Number of Units:</strong> {formData.numberOfUnits}</p>
            <p><strong>Payment Option:</strong> {formData.paymentOption}</p>
            <p><strong>Payment Plan Duration:</strong> {formData.paymentPlanDuration}</p>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next of Kin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {formData.nextOfKinName}</p>
            <p><strong>Phone:</strong> {formData.nextOfKinPhone}</p>
            <p><strong>Relationship:</strong> {formData.nextOfKinRelationship}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">House Purchase Application</h1>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of 4
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-elegant">
        <CardContent className="p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 hero-gradient text-white"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.termsAccepted}
                className="hero-gradient text-white"
              >
                Submit Application
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationForm;