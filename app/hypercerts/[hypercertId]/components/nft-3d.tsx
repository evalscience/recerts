import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import React from "react";

const NFT3D = ({ src }: { src: string }) => {
  return (
    <CardContainer>
      <CardBody className="rounded-xl shadow-xl">
        <CardItem className="">
          <Image
            src={src}
            alt="Hypercert NFT"
            width={300}
            height={300}
            className="w-full max-w-sm h-auto"
          />
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

export default NFT3D;
