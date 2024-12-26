import { FullHypercert } from "@/app/graphql-queries/hypercerts";
import MapRenderer from "@/components/map-renderer";
import React from "react";
import ImpactDetails from "./impact-details";
import EvaluationDetails from "./evaluation-details";

const RightContent = ({ hypercert }: { hypercert: FullHypercert }) => {
  return (
    <div className="w-full md:w-auto flex-initial md:flex-[2] flex flex-col gap-6">
      <section className="w-full flex flex-col gap-2">
        <h2 className="font-bold text-xl text-muted-foreground">Impact</h2>
        <ImpactDetails hypercert={hypercert} />
      </section>
      <section className="w-full flex flex-col gap-2">
        <h2 className="font-bold text-xl text-muted-foreground">
          Verification
        </h2>
        <EvaluationDetails />
      </section>
      {hypercert.uri && (
        <section className="w-full flex flex-col gap-2">
          <h2 className="font-bold text-xl text-muted-foreground">
            Site Boundaries
          </h2>
          <div className="w-full flex items-center justify-center">
            <MapRenderer uri={hypercert.uri} />
          </div>
        </section>
      )}
    </div>
  );
};

export default RightContent;
