import { ShieldCheck } from "lucide-react";
import React from "react";

const EvaluationDetails = () => {
  return (
    <div className="group border border-border rounded-xl p-4 overflow-hidden">
      <div className="h-28 w-full flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 bg-primary/30 rounded-full group-hover:animate-ping blur-lg"></div>
        </div>
        <ShieldCheck size={60} className="text-primary" />
      </div>
      <div className="w-full flex flex-col items-center gap-1 px-8 py-4">
        <span className="text-center text-muted-foreground leading-none">
          This hypercerts and the work it represents have been verified by
        </span>
        <span className="text-center text-foreground text-xl font-bold">
          GainForest.Earth
        </span>
      </div>
    </div>
  );
};

export default EvaluationDetails;
