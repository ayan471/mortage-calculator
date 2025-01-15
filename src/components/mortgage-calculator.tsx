"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CalculationResult {
  monthlyPayment: number;
  totalRepayment: number;
}

export default function MortgageCalculator() {
  const [mortgageAmount, setMortgageAmount] = useState("");
  const [mortgageTerm, setMortgageTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [mortgageType, setMortgageType] = useState<"repayment" | "interest">(
    "repayment"
  );
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!mortgageAmount) newErrors.mortgageAmount = "This field is required";
    if (!mortgageTerm) newErrors.mortgageTerm = "This field is required";
    if (!interestRate) newErrors.interestRate = "This field is required";
    if (!mortgageType) newErrors.mortgageType = "This field is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateRepayments = () => {
    if (!validateForm()) return;

    const principal = Number(mortgageAmount);
    const years = Number(mortgageTerm);
    const rate = Number(interestRate) / 100 / 12;
    const numberOfPayments = years * 12;

    let monthlyPayment: number;

    if (mortgageType === "repayment") {
      monthlyPayment =
        (principal * rate * Math.pow(1 + rate, numberOfPayments)) /
        (Math.pow(1 + rate, numberOfPayments) - 1);
    } else {
      monthlyPayment = principal * rate;
    }

    const totalRepayment = monthlyPayment * numberOfPayments;

    setResult({
      monthlyPayment,
      totalRepayment:
        mortgageType === "repayment"
          ? totalRepayment
          : principal + totalRepayment,
    });
  };

  const clearAll = () => {
    setMortgageAmount("");
    setMortgageTerm("");
    setInterestRate("");
    setMortgageType("repayment");
    setResult(null);
    setErrors({});
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-lg">
      <div className="flex flex-col md:flex-row">
        <div className="p-8 md:w-1/2">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Mortgage Calculator
            </h1>
            <button
              onClick={clearAll}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Mortgage Amount
              </label>
              <div className="relative overflow-hidden rounded-lg">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 w-12 flex items-center justify-center",
                    errors.mortgageAmount
                      ? "bg-red-500 text-white"
                      : "bg-[#F4F8FF] text-gray-500"
                  )}
                >
                  £
                </div>
                <input
                  type="text"
                  value={mortgageAmount}
                  onChange={(e) => setMortgageAmount(e.target.value)}
                  className={cn(
                    "w-full py-3 pl-12 pr-4 transition-colors",
                    errors.mortgageAmount
                      ? "border border-red-500"
                      : "border border-gray-200 focus:ring-2 focus:ring-[#E7F55B]/20"
                  )}
                  placeholder="0"
                />
              </div>
              {errors.mortgageAmount && (
                <p className="mt-2 text-red-500 text-sm">
                  {errors.mortgageAmount}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Mortgage Term
                </label>
                <div className="relative overflow-hidden rounded-lg">
                  <input
                    type="text"
                    value={mortgageTerm}
                    onChange={(e) => setMortgageTerm(e.target.value)}
                    className={cn(
                      "w-full py-3 pl-4 pr-16 transition-colors",
                      errors.mortgageTerm
                        ? "border border-red-500"
                        : "border border-gray-200 focus:ring-2 focus:ring-[#E7F55B]/20"
                    )}
                    placeholder="0"
                  />
                  <div
                    className={cn(
                      "absolute inset-y-0 right-0 px-4 flex items-center",
                      errors.mortgageTerm
                        ? "bg-red-500 text-white"
                        : "text-gray-500"
                    )}
                  >
                    years
                  </div>
                </div>
                {errors.mortgageTerm && (
                  <p className="mt-2 text-red-500 text-sm">
                    {errors.mortgageTerm}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Interest Rate
                </label>
                <div className="relative overflow-hidden rounded-lg">
                  <input
                    type="text"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className={cn(
                      "w-full py-3 pl-4 pr-10 transition-colors",
                      errors.interestRate
                        ? "border border-red-500"
                        : "border border-gray-200 focus:ring-2 focus:ring-[#E7F55B]/20"
                    )}
                    placeholder="0"
                  />
                  <div
                    className={cn(
                      "absolute inset-y-0 right-0 px-4 flex items-center",
                      errors.interestRate
                        ? "bg-red-500 text-white"
                        : "text-gray-500"
                    )}
                  >
                    %
                  </div>
                </div>
                {errors.interestRate && (
                  <p className="mt-2 text-red-500 text-sm">
                    {errors.interestRate}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-3">
                Mortgage Type
              </label>
              <div className="space-y-2">
                <label
                  className={cn(
                    "flex items-center p-4 rounded-lg cursor-pointer border transition-colors",
                    mortgageType === "repayment"
                      ? "bg-[#E7F55B]/10 border-[#E7F55B]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <input
                    type="radio"
                    name="mortgageType"
                    value="repayment"
                    checked={mortgageType === "repayment"}
                    onChange={(e) =>
                      setMortgageType(e.target.value as "repayment")
                    }
                    className="hidden"
                  />
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full border mr-3",
                      mortgageType === "repayment"
                        ? "bg-[#E7F55B] border-[#E7F55B]"
                        : "border-gray-300"
                    )}
                  />
                  <span className="text-gray-900">Repayment</span>
                </label>

                <label
                  className={cn(
                    "flex items-center p-4 rounded-lg cursor-pointer border transition-colors",
                    mortgageType === "interest"
                      ? "bg-[#E7F55B]/10 border-[#E7F55B]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <input
                    type="radio"
                    name="mortgageType"
                    value="interest"
                    checked={mortgageType === "interest"}
                    onChange={(e) =>
                      setMortgageType(e.target.value as "interest")
                    }
                    className="hidden"
                  />
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full border mr-3",
                      mortgageType === "interest"
                        ? "bg-[#E7F55B] border-[#E7F55B]"
                        : "border-gray-300"
                    )}
                  />
                  <span className="text-gray-900">Interest Only</span>
                </label>
              </div>
              {errors.mortgageType && (
                <p className="mt-2 text-red-500 text-sm">
                  {errors.mortgageType}
                </p>
              )}
            </div>

            <button
              onClick={calculateRepayments}
              className="w-full bg-[#E7F55B] text-gray-900 py-4 rounded-lg font-medium hover:bg-[#E7F55B]/90 focus:outline-none focus:ring-2 focus:ring-[#E7F55B]/20 transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculate Repayments
            </button>
          </div>
        </div>

        <div className="bg-[#1B2C4F] p-8 md:w-1/2 flex flex-col items-center justify-center text-center rounded-r-3xl">
          {result ? (
            <div className="w-full">
              <h2 className="text-2xl font-bold text-white mb-2">
                Your results
              </h2>
              <p className="text-gray-400 mb-8">
                Your results are shown below based on the information you
                provided. To adjust the results, edit the form and click
                &quot;calculate repayments&quot; again.
              </p>
              <div className="space-y-6">
                <div className="p-6 bg-[#1B2C4F] border-t border-[#E7F55B]">
                  <p className="text-gray-400 mb-2">Your monthly repayments</p>
                  <p className="text-[#E7F55B] text-4xl font-bold">
                    £
                    {result.monthlyPayment.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">
                    Total yo&apos;ll repay over the term
                  </p>
                  <p className="text-white text-2xl font-bold">
                    £
                    {result.totalRepayment.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Image
                src="illustration-empty.svg"
                className="mx-auto mb-6"
                alt="empty"
                width={250}
                height={250}
              />
              <h2 className="text-2xl font-bold text-white mb-2">
                Results shown here
              </h2>
              <p className="text-gray-400">
                Complete the form and click &quot;calculate repayments&quot; to
                see what your monthly repayments would be.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
