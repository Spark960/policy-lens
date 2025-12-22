// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

// The Economic Logic Engine
export const calculateImpact = (fuelTax: number, importDuty: number, gst: number) => {
  const baseStudent = 12000;
  const baseFarmer = 18000;
  const basePro = 55000;

  // Impact Logic (Weighted multipliers)
  const farmerImpact = baseFarmer + (fuelTax * 180) + (gst * 25);
  const studentImpact = baseStudent + (importDuty * 120) + (gst * 60) + (fuelTax * 15);
  const proImpact = basePro + (gst * 300) + (fuelTax * 60) + (importDuty * 50);

  return {
    student: { val: studentImpact, base: baseStudent },
    farmer: { val: farmerImpact, base: baseFarmer },
    pro: { val: proImpact, base: basePro },
  };
};