import { Button } from "@/components/ui/button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Skeleton = ({
  className,
  delayInMs = 0,
}: {
  className?: string;
  delayInMs?: number;
}) => {
  return (
    <div
      className={`bg-muted max-w-full animate-pulse rounded-xl ${
        className ?? ""
      }`}
      style={{
        animationDelay: `${delayInMs}ms`,
      }}
    ></div>
  );
};

const Loading = () => {
  return (
    <MotionWrapper
      type="div"
      className="w-full flex flex-col items-center"
      initial={{
        opacity: 0,
        y: 100,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
    >
      <div className="w-full max-w-6xl p-8 flex flex-col gap-2">
        <Link href={"/"}>
          <Button variant={"link"} className="gap-2 p-0">
            <ChevronLeft size={20} /> View all hypercerts
          </Button>
        </Link>
        <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-12">
          <div className="flex flex-col flex-1 gap-2">
            {/* title */}
            <Skeleton className="h-12 w-1/2" />
            {/* metadata */}
            <Skeleton className="h-8 w-[80%]" />

            <div className="flex items-center flex-wrap gap-2">
              {/* tags */}
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
          {/* progress */}
          <Skeleton className="h-40 w-full md:w-auto flex-initial md:flex-1" />
        </div>
        <div className="flex flex-col md:flex-row items-start w-full gap-8 mt-12">
          <div className="flex-initial w-full md:w-auto md:flex-[3] flex flex-col gap-4">
            <div className="flex items-center justify-center w-full">
              {/* nft */}
              <Skeleton className="w-[80%] aspect-square" />
            </div>

            {/* description */}
            <Skeleton className="h-8 w-32 mt-6" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-1/2" />
            </div>

            {/* sales */}
            <Skeleton className="h-8 w-32 mt-6" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <div className="flex-initial md:flex-[2] flex flex-col w-full md:w-auto gap-4">
            {/* Impact Details */}
            <section className="w-full flex flex-col gap-2">
              <Skeleton className="h-8 w-32 mt-4" />
              <Skeleton className="h-60 w-full mt-4" />
            </section>

            {/* Verification */}
            <section className="w-full flex flex-col gap-2">
              <Skeleton className="h-8 w-32 mt-4" />
              <Skeleton className="h-60 w-full mt-4" />
            </section>

            {/* Geolocation */}
            <section className="w-full flex flex-col gap-2">
              <Skeleton className="h-8 w-32 mt-4" />
              <Skeleton className="h-60 w-full mt-4" />
            </section>
          </div>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default Loading;
