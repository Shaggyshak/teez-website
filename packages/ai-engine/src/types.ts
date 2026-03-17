import type { AssetType, RentRollUnit, T12Data, RiskFlag, ProFormaProjection } from "@teez/shared";

export interface DocumentParseRequest {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  assetType?: AssetType;
}

export interface DocumentParseResult {
  success: boolean;
  documentType: "rent-roll" | "t12" | "operating-memo" | "unknown";
  rentRoll?: RentRollUnit[];
  t12?: T12Data[];
  rawText?: string;
  confidence: number;
  errors?: string[];
}

export interface ProFormaRequest {
  assetType: AssetType;
  rentRoll: RentRollUnit[];
  t12: T12Data[];
  assumptions: ProFormaAssumptions;
}

export interface ProFormaAssumptions {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  amortizationYears: number;
  holdPeriodYears: number;
  rentGrowthRate: number;
  expenseGrowthRate: number;
  exitCapRate: number;
  vacancyRate: number;
  managementFeePercent: number;
  capexReservePerUnit: number;
}

export interface ProFormaResult {
  projections: ProFormaProjection[];
  metrics: {
    irr: number;
    equityMultiple: number;
    averageCashOnCash: number;
    totalProfit: number;
    goingInCapRate: number;
  };
  riskFlags: RiskFlag[];
}

export interface SensitivityAnalysis {
  variable: string;
  baseValue: number;
  range: { value: number; irr: number; cashOnCash: number }[];
}
