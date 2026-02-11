"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { label: "Connect" },
  { label: "Pick Document" },
  { label: "Create Event" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-md mx-auto">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <motion.div
                    className="absolute w-9 h-9 rounded-full bg-accent/30"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                    isCompleted
                      ? "bg-accent text-accent-foreground"
                      : isActive
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-muted-foreground border border-border"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isCompleted || isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="relative flex-1 h-0.5 mx-2 bg-border self-start mt-4">
                <motion.div
                  className="absolute inset-0 bg-accent origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
