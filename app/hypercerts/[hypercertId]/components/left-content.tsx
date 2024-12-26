import { FullHypercert } from "@/app/graphql-queries/hypercerts";
import React from "react";
import NFT3D from "./nft-3d";
import Support from "./support";

const LeftContent = ({ hypercert }: { hypercert: FullHypercert }) => {
  return (
    <div className="w-full flex md:w-auto flex-initial md:flex-[3] flex-col gap-6">
      {hypercert.image && (
        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-sm">
            <NFT3D src={hypercert.image} />
          </div>
        </div>
      )}
      <section className="w-full flex flex-col">
        <h2 className="font-bold text-xl text-muted-foreground">Description</h2>
        <p>{hypercert.description}</p>
      </section>
      <section className="w-full flex flex-col gap-2">
        <h2 className="font-bold text-xl text-muted-foreground">Support</h2>
        <Support hypercert={hypercert} />
      </section>
    </div>
  );
};

export default LeftContent;
