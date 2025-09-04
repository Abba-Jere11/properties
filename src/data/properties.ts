import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import marina1 from "@/assets/marina/marina 1.jpg";
import marina2 from "@/assets/marina/marina 2.jpg";
import marina3 from "@/assets/marina/marina 3.jpg";
import marina4 from "@/assets/marina/marina 4.jpg";
import bakassi1 from "@/assets/bakassi/bakassi 1.jpg";
import bakassi2 from "@/assets/bakassi/bakassi 2.jpg";
import bakassi3 from "@/assets/bakassi/bakassi 3.jpg";
import bakassi4 from "@/assets/bakassi/bakassi 4.jpg";
import bakassi5 from "@/assets/bakassi/bakassi 4 opt.jpg";

import teacher1 from "@/assets/teachersVillage/teacher1.jpg";
import teacher2 from "@/assets/teachersVillage/teacher2.jpg";
import teacher3 from "@/assets/teachersVillage/teacher3.jpg";

import teacher4 from "@/assets/teachersVillage/teacher4.jpg";
import teacher5 from "@/assets/teachersVillage/teacher5.jpg";
import teacher6 from "@/assets/teachersVillage/teacher6.jpg";
import teacher7 from "@/assets/teachersVillage/teacher7.jpg";
import nitp1 from "@/assets/nitp/nitp 1.jpg";
import nitp2 from "@/assets/nitp/nitp 2.jpg";
import nitp3 from "@/assets/nitp/nitp 3.jpg";
import nitp4 from "@/assets/nitp/nitp main.jpg";2
// import b4kassi4 from "@/assets/bakassi/bakassi 4.jpg"34

export interface Property {
  id: string;
  title: string;
  price: string;
  priceNumeric: number;
  location: string;
  estate: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  toilets: number;
  sittingRooms: number;
  landSize: string;
  buildingSize: string;
  backyardSize: string;
  image: string;
  images: string[];
  status: "available" | "sold" | "pending";
  featured: boolean;
  description: string;
  features: string[];
  streetName: string;
  houseNumber: string;
  paymentPlans: {
    outright: {
      amount: number;
      description: string;
    };
    musharakah: {
      firstStake: number;
      rentalValue: number;
      appreciation: number;
      description: string;
    };
    murabahah: {
      minimumDeposit: number;
      plans: {
        duration: number;
        monthlyPayment: number;
        totalAmount: number;
      }[];
      description: string;
    };
    ijarah: {
      annualRent: number;
      description: string;
    };
  };
}

export const properties: Property[] = [
  
  {
    id: "bakassi-street1-house2",
    title: "Spacious Family Bungalow - Bakassi GRA",
    price: "₦40,000,000",
    priceNumeric: 40000000,
    location: "Bakassi GRA, Maiduguri",
    estate: "Bakassi Estate",
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'residential',
    toilets: 3,
    sittingRooms: 2,
    landSize: "700 sqm",
    buildingSize: "180 sqm",
    backyardSize: "100 sqm",
    image: bakassi5,
    images: [bakassi2, bakassi4, bakassi3],
    status: "available",
    featured: false,
    streetName: "Bakassi Street 1",
    houseNumber: "House 2",
    description: "Sitting on 700sqm with 2 bedrooom, 2 parlours, 3 toilets, kitchen and a backyard",
    features: [
      "Fenced Estate with 24/7 Security",
      "33KVA Electricity Supply",
      "Water Reticulation System",
      "Green Area Landscape",
      
   
    ],
    paymentPlans: {
      outright: {
        amount: 40000000,
        description: "Pay N40,000,000 upfront and own the property immediately."
      },
      musharakah: {
        firstStake: 10000000,
        rentalValue: 1500000,
        appreciation: 7.5,
        description: "Sharia'ah compliant diminishing partnership by Fulus Capital"
      },
      murabahah: {
        minimumDeposit: 5000000,
        plans: [
          { duration: 12, monthlyPayment: 3100000, totalAmount: 42200000 },
          { duration: 24, monthlyPayment: 1700000, totalAmount: 45800000 },
          { duration: 36, monthlyPayment: 1200000, totalAmount: 48200000 },
          { duration: 48, monthlyPayment: 980000, totalAmount: 52040000 }
        ],
        description: "Sharia'ah compliant cost plus installments"
      },
      ijarah: {
        annualRent: 1500000,
        description: "Rental/Lease with option of sale"
      }
    },

  },
  {
    id: "teachers-street1-house1",
    title: "Spacious Family Bungalow - Teachers Village",
    price: "₦40,000,000",
    priceNumeric: 40000000,
    location: "Teachers Village, Maiduguri",
    estate: "Teachers Village",
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'residential',
    toilets: 3,
    sittingRooms: 2,
    landSize: "700 sqm",
    buildingSize: "180 sqm",
    backyardSize: "100 sqm",
    image: teacher5,
    images: [teacher5, teacher6, teacher7],
    status: "available",
    featured: true,
    streetName: "Teachers Street 1",
    houseNumber: "House 1",
    description: "Embrace the educational community lifestyle in this exceptional spacious family bungalow in Teachers Village. Designed families who value quality education and community living.",
    features: [
      "Fenced Estate with 24/7 Security",
      "33KVA Electricity Supply",
      "Water Reticulation System",
      "Green Area Landscape",
     
    ],
    paymentPlans: {
      outright: {
        amount: 40000000,
        description: "One-time payment with immediate ownership transfer"
      },
      musharakah: {
        firstStake: 10000000,
        rentalValue: 1500000,
        appreciation: 7.5,
        description: "Sharia'ah compliant diminishing partnership by Fulus Capital"
      },
      murabahah: {
        minimumDeposit: 5000000,
        plans: [
          { duration: 12, monthlyPayment: 3100000, totalAmount: 42200000 },
          { duration: 24, monthlyPayment: 1700000, totalAmount: 45800000 },
          { duration: 36, monthlyPayment: 1200000, totalAmount: 48200000 },
          { duration: 48, monthlyPayment: 980000, totalAmount: 52040000 }
        ],
        description: "Sharia'ah compliant cost plus installments"
      },
      ijarah: {
        annualRent: 1500000,
        description: "Rental/Lease with option of sale"
      }
    },
   
  },
  {
    id: "abuja-marina-towers",
    title: "Abuja Marina Towers",
    price: "...",
    priceNumeric: 40000000,
    location: "Central Business District, Abuja",
    estate: "Abuja Marina Towers",
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'commercial',
    toilets: 3,
    sittingRooms: 2,
    landSize: "700 sqm",
    buildingSize: "180 sqm",
    backyardSize: "100 sqm",
    image: marina1,
    images: [marina1, marina2, marina3,marina4],
    status: "available",
    featured: true,
    streetName: "Teachers Street 1",
    houseNumber: "House 1",
    description: "A landmark 10-storey commercial complex strategically located in the heart of Abujas Central Business District. This prestigious development features 10 premium units tailored for offices, corporate headquarters, and high-end businesses.",
    features: [
      "Prime CBD Location",
      "10 Floors, 10 Units",
      "2 Floors of Secure Parking",
      "24/7 Security",
   
    ],
    paymentPlans: {
      outright: {
        amount: 40000000,
        description: "One-time payment with immediate ownership transfer"
      },
      musharakah: {
        firstStake: 10000000,
        rentalValue: 1500000,
        appreciation: 7.5,
        description: "Sharia'ah compliant diminishing partnership by Fulus Capital"
      },
      murabahah: {
        minimumDeposit: 5000000,
        plans: [
          { duration: 12, monthlyPayment: 3100000, totalAmount: 42200000 },
          { duration: 24, monthlyPayment: 1700000, totalAmount: 45800000 },
          { duration: 36, monthlyPayment: 1200000, totalAmount: 48200000 },
          { duration: 48, monthlyPayment: 980000, totalAmount: 52040000 }
        ],
        description: "Sharia'ah compliant cost plus installments"
      },
      ijarah: {
        annualRent: 1500000,
        description: "Rental/Lease with option of sale"
      }
    },
   
  },
  {
    id: "nitp",
    title: "NITP",
    price: "...",
    priceNumeric: 40000000,
    location: "Wuse Zone 1, Abuja",
    estate: "National Institute of Town Planners",
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'commercial',
    toilets: 3,
    sittingRooms: 2,
    landSize: "700 sqm",
    buildingSize: "180 sqm",
    backyardSize: "100 sqm",
    image: nitp4,
    images: [nitp1, nitp2, nitp3],
    status: "available",
    featured: true,
    streetName: "Teachers Street 1",
    houseNumber: "House 1",
    description: "Located in the heart of Wuse, this property offers a perfect mix of business and living. The front features 3 units of 4-floor commercial blocks, while the back hosts 4 units of spacious 5-bedroom detached bungalows in a secure and accessible environment..",
    features: [
   
      "Prime Wuse location",
      "3 units of 4-floor commercial",
      "4 units of 5-bedroom bungalows",
      "Secure, gated premises with parking"
      
    ],
    paymentPlans: {
      outright: {
        amount: 40000000,
        description: "One-time payment with immediate ownership transfer"
      },
      musharakah: {
        firstStake: 10000000,
        rentalValue: 1500000,
        appreciation: 7.5,
        description: "Sharia'ah compliant diminishing partnership by Fulus Capital"
      },
      murabahah: {
        minimumDeposit: 5000000,
        plans: [
          { duration: 12, monthlyPayment: 3100000, totalAmount: 42200000 },
          { duration: 24, monthlyPayment: 1700000, totalAmount: 45800000 },
          { duration: 36, monthlyPayment: 1200000, totalAmount: 48200000 },
          { duration: 48, monthlyPayment: 980000, totalAmount: 52040000 }
        ],
        description: "Sharia'ah compliant cost plus installments"
      },
      ijarah: {
        annualRent: 1500000,
        description: "Rental/Lease with option of sale"
      }
    },
   
  },

];

export const getPropertyById = (id: string) => {
  return properties.find(property => property.id === id);
};

export const getFeaturedProperties = () => {
  return properties.filter(property => property.featured);
};

export const getPropertiesByEstate = (estate: string) => {
  return properties.filter(property => property.estate.toLowerCase().includes(estate.toLowerCase()));
};