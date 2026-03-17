import type { ProFormaRequest, ProFormaResult, SensitivityAnalysis } from "./types";
import type { ProFormaProjection, RiskFlag } from "@teez/shared";

/**
 * Generate a pro-forma projection from rent roll + T-12 data with given assumptions.
 */
export function generateProForma(request: ProFormaRequest): ProFormaResult {
  const { rentRoll, t12, assumptions } = request;

  // Current income from rent roll
  const annualGrossRent =
    rentRoll.reduce((sum, u) => sum + u.monthlyRent, 0) * 12;
  const totalUnits = rentRoll.length;

  // Latest T-12 operating expenses
  const latestT12 = t12[t12.length - 1];
  const currentExpenses = latestT12
    ? Object.values(latestT12.operatingExpenses).reduce((a, b) => a + b, 0)
    : annualGrossRent * 0.45; // default 45% expense ratio

  // Loan calculations
  const loanAmount =
    assumptions.purchasePrice * (1 - assumptions.downPayment);
  const equityInvested = assumptions.purchasePrice * assumptions.downPayment;
  const monthlyRate = assumptions.interestRate / 12;
  const totalPayments = assumptions.amortizationYears * 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : loanAmount / totalPayments;
  const annualDebtService = monthlyPayment * 12;

  // Generate year-by-year projections
  const projections: ProFormaProjection[] = [];
  const cashFlows: number[] = [-equityInvested];

  for (let year = 1; year <= assumptions.holdPeriodYears; year++) {
    const growthFactor = Math.pow(1 + assumptions.rentGrowthRate, year - 1);
    const expenseGrowthFactor = Math.pow(
      1 + assumptions.expenseGrowthRate,
      year - 1
    );

    const gpr = annualGrossRent * growthFactor;
    const vacancyLoss = gpr * assumptions.vacancyRate;
    const egi = gpr - vacancyLoss;

    const opex = currentExpenses * expenseGrowthFactor;
    const mgmtFee = egi * assumptions.managementFeePercent;
    const capex = assumptions.capexReservePerUnit * totalUnits;
    const totalExpenses = opex + mgmtFee + capex;

    const noi = egi - totalExpenses;
    const ds = year <= assumptions.loanTermYears ? annualDebtService : 0;
    const cf = noi - ds;
    const coc = equityInvested > 0 ? cf / equityInvested : 0;
    const capRate =
      assumptions.purchasePrice > 0
        ? noi / assumptions.purchasePrice
        : 0;

    projections.push({
      year,
      grossPotentialRent: Math.round(gpr),
      vacancyRate: assumptions.vacancyRate,
      effectiveGrossIncome: Math.round(egi),
      totalExpenses: Math.round(totalExpenses),
      netOperatingIncome: Math.round(noi),
      debtService: Math.round(ds),
      cashFlow: Math.round(cf),
      cashOnCash: Number(coc.toFixed(4)),
      capRate: Number(capRate.toFixed(4)),
    });

    cashFlows.push(cf);
  }

  // Exit value and final cash flow
  const exitNOI = projections[projections.length - 1]?.netOperatingIncome ?? 0;
  const exitValue = assumptions.exitCapRate > 0 ? exitNOI / assumptions.exitCapRate : 0;
  const remainingLoan = calculateRemainingLoan(
    loanAmount,
    monthlyRate,
    totalPayments,
    assumptions.holdPeriodYears * 12
  );
  const exitProceeds = exitValue - remainingLoan;
  cashFlows[cashFlows.length - 1] += exitProceeds;

  const irr = calculateIRR(cashFlows);
  const totalCashReturned = cashFlows.slice(1).reduce((a, b) => a + b, 0);
  const equityMultiple =
    equityInvested > 0 ? totalCashReturned / equityInvested : 0;
  const avgCoc =
    projections.reduce((sum, p) => sum + p.cashOnCash, 0) /
    projections.length;

  const riskFlags = generateRiskFlags(request, projections);

  return {
    projections,
    metrics: {
      irr: Number(irr.toFixed(4)),
      equityMultiple: Number(equityMultiple.toFixed(2)),
      averageCashOnCash: Number(avgCoc.toFixed(4)),
      totalProfit: Math.round(totalCashReturned - equityInvested),
      goingInCapRate: Number(
        (
          (projections[0]?.netOperatingIncome ?? 0) / assumptions.purchasePrice
        ).toFixed(4)
      ),
    },
    riskFlags,
  };
}

/**
 * Run sensitivity analysis on a single variable.
 */
export function runSensitivity(
  request: ProFormaRequest,
  variable: keyof ProFormaRequest["assumptions"],
  steps: number[]
): SensitivityAnalysis {
  const results = steps.map((value) => {
    const modified = {
      ...request,
      assumptions: { ...request.assumptions, [variable]: value },
    };
    const result = generateProForma(modified);
    return {
      value,
      irr: result.metrics.irr,
      cashOnCash: result.metrics.averageCashOnCash,
    };
  });

  return {
    variable: String(variable),
    baseValue: request.assumptions[variable] as number,
    range: results,
  };
}

function calculateIRR(cashFlows: number[], guess = 0.1): number {
  const maxIter = 1000;
  const tolerance = 1e-7;
  let rate = guess;

  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const factor = Math.pow(1 + rate, t);
      npv += cashFlows[t] / factor;
      dnpv -= (t * cashFlows[t]) / (factor * (1 + rate));
    }
    if (Math.abs(npv) < tolerance) return rate;
    if (dnpv === 0) break;
    rate -= npv / dnpv;
  }
  return rate;
}

function calculateRemainingLoan(
  principal: number,
  monthlyRate: number,
  totalPayments: number,
  paymentsMade: number
): number {
  if (monthlyRate === 0) {
    return principal * (1 - paymentsMade / totalPayments);
  }
  const factor = Math.pow(1 + monthlyRate, paymentsMade);
  return (
    principal * factor -
    ((principal * monthlyRate * (factor - 1)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)) *
      ((factor - 1) / monthlyRate)
  );
}

function generateRiskFlags(
  request: ProFormaRequest,
  projections: ProFormaProjection[]
): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const { rentRoll, assumptions } = request;

  // Below-market rents
  const belowMarket = rentRoll.filter(
    (u) => !u.isVacant && u.marketRent > 0 && u.monthlyRent < u.marketRent * 0.85
  );
  if (belowMarket.length > 0) {
    flags.push({
      severity: "info",
      category: "Rent",
      message: `${belowMarket.length} units significantly below market rent`,
      detail: `Units ${belowMarket.map((u) => u.unitNumber).join(", ")} are 15%+ below market. Potential upside on lease renewal.`,
    });
  }

  // High vacancy
  const vacantCount = rentRoll.filter((u) => u.isVacant).length;
  const vacancyRate = rentRoll.length > 0 ? vacantCount / rentRoll.length : 0;
  if (vacancyRate > 0.1) {
    flags.push({
      severity: vacancyRate > 0.2 ? "critical" : "warning",
      category: "Vacancy",
      message: `Physical vacancy at ${(vacancyRate * 100).toFixed(0)}%`,
      detail: `${vacantCount} of ${rentRoll.length} units vacant. Market average is typically 5-7%.`,
    });
  }

  // Negative cash flow
  const negativeCF = projections.filter((p) => p.cashFlow < 0);
  if (negativeCF.length > 0) {
    flags.push({
      severity: "critical",
      category: "Cash Flow",
      message: `Negative cash flow in year${negativeCF.length > 1 ? "s" : ""} ${negativeCF.map((p) => p.year).join(", ")}`,
      detail: "Deal shows negative returns in some projection years. Review assumptions.",
    });
  }

  // Cap rate compression risk
  const goingInCap = assumptions.purchasePrice > 0
    ? (projections[0]?.netOperatingIncome ?? 0) / assumptions.purchasePrice
    : 0;
  if (assumptions.exitCapRate < goingInCap) {
    flags.push({
      severity: "warning",
      category: "Cap Rate",
      message: "Exit cap rate assumes compression",
      detail: `Exit cap ${(assumptions.exitCapRate * 100).toFixed(1)}% is below going-in cap. This is an aggressive assumption.`,
    });
  }

  return flags;
}
