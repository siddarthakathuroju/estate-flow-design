
export interface ERCStandard {
  id: string;
  name: string;
  description: string;
  useCase: string;
  properties: string[];
  relevance: string;
}

// Comprehensive collection of Ethereum token standards
export const ERC_STANDARDS: ERCStandard[] = [
  {
    id: "erc20",
    name: "ERC-20",
    description: "Fungible Token Standard",
    useCase: "Cryptocurrencies, utility tokens, governance tokens",
    properties: [
      "Fungible (interchangeable)",
      "Divisible",
      "Uniform"
    ],
    relevance: "Used for creating property-backed tokens for fractional investment."
  },
  {
    id: "erc721",
    name: "ERC-721",
    description: "Non-Fungible Token Standard",
    useCase: "Digital property deeds, unique collectibles, art",
    properties: [
      "Non-fungible (unique)",
      "Indivisible",
      "Ownership tracking"
    ],
    relevance: "Primary standard for representing ownership of individual properties on the platform."
  },
  {
    id: "erc1155",
    name: "ERC-1155",
    description: "Multi-Token Standard",
    useCase: "Gaming assets, mixed fungible/non-fungible collections",
    properties: [
      "Both fungible and non-fungible",
      "Batch transfers",
      "Gas efficient"
    ],
    relevance: "Enables representation of both full properties and fractional shares in a single contract."
  },
  {
    id: "erc4907",
    name: "ERC-4907",
    description: "Rental NFT Standard",
    useCase: "Temporary usage rights, lending, rentals",
    properties: [
      "Time-bound usage rights",
      "Maintains ownership",
      "Expiration functionality"
    ],
    relevance: "Facilitates rental agreements for properties while maintaining ownership records."
  },
  {
    id: "erc2981",
    name: "ERC-2981",
    description: "NFT Royalty Standard",
    useCase: "Creator royalties, ongoing revenue streams",
    properties: [
      "Automated royalties",
      "Secondary sales compensation",
      "Creator attribution"
    ],
    relevance: "Ensures property developers receive royalties on secondary market transactions."
  },
  {
    id: "erc3643",
    name: "ERC-3643",
    description: "Security Token Standard",
    useCase: "Regulatory compliant security tokens",
    properties: [
      "Identity verification",
      "Regulatory compliance",
      "Transfer restrictions"
    ],
    relevance: "Used for tokenized real estate that must comply with securities regulations."
  },
  {
    id: "erc5095",
    name: "ERC-5095",
    description: "Mortgage NFT Standard",
    useCase: "Mortgage-backed securities, loans",
    properties: [
      "Supports mortgage terms",
      "Interest calculation",
      "Loan tracking"
    ],
    relevance: "Enables property mortgage tracking and management as blockchain assets."
  },
  {
    id: "erc6551",
    name: "ERC-6551",
    description: "Token Bound Accounts",
    useCase: "NFTs that own assets",
    properties: [
      "NFTs as smart contract accounts",
      "Self-custody",
      "Asset ownership by NFTs"
    ],
    relevance: "Allows properties (as NFTs) to own and manage their own assets, such as rental income."
  }
];

// Get an ERC standard by ID
export const getERCStandardById = (id: string): ERCStandard | undefined => {
  return ERC_STANDARDS.find(standard => standard.id === id);
};

// Get ERC standards by relevance (property, investment, etc.)
export const getERCStandardsByKeyword = (keyword: string): ERCStandard[] => {
  const lowercaseKeyword = keyword.toLowerCase();
  return ERC_STANDARDS.filter(
    standard => 
      standard.relevance.toLowerCase().includes(lowercaseKeyword) ||
      standard.useCase.toLowerCase().includes(lowercaseKeyword)
  );
};

// Get all property-related ERC standards
export const getPropertyERCStandards = (): ERCStandard[] => {
  return getERCStandardsByKeyword('property');
};
