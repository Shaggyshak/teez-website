export type AssetType = "multifamily" | "industrial" | "retail" | "mixed-use" | "office";

export type DealStatus = "draft" | "analyzing" | "complete" | "archived";

export interface Deal {
  id: string;
  userId: string;
  name: string;
  assetType: AssetType;
  address: string;
  status: DealStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  role: string | null;
  createdAt: Date;
}

export interface RentRollUnit {
  unitNumber: string;
  unitType: string;
  sqft: number;
  monthlyRent: number;
  marketRent: number;
  isVacant: boolean;
  leaseStart: string | null;
  leaseEnd: string | null;
  tenant: string | null;
}

export interface T12Data {
  month: string;
  grossPotentialRent: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  operatingExpenses: Record<string, number>;
  netOperatingIncome: number;
}

export interface ProFormaProjection {
  year: number;
  grossPotentialRent: number;
  vacancyRate: number;
  effectiveGrossIncome: number;
  totalExpenses: number;
  netOperatingIncome: number;
  debtService: number;
  cashFlow: number;
  cashOnCash: number;
  capRate: number;
}

export interface UnderwritingResult {
  dealId: string;
  assetType: AssetType;
  rentRoll: RentRollUnit[];
  t12: T12Data[];
  proForma: ProFormaProjection[];
  metrics: {
    purchasePrice: number;
    totalUnits: number;
    totalSqft: number;
    currentNOI: number;
    stabilizedNOI: number;
    goingInCapRate: number;
    exitCapRate: number;
    irr: number;
    equityMultiple: number;
    averageRentPerUnit: number;
    averageRentPerSqft: number;
    occupancyRate: number;
    expenseRatio: number;
  };
  riskFlags: RiskFlag[];
}

export interface RiskFlag {
  severity: "info" | "warning" | "critical";
  category: string;
  message: string;
  detail: string;
}
