import PageError from "@/app/components/PageError";
import Progress from "@/app/components/progress";
import {
  fetchFullHypercertById,
  FullHypercert,
} from "@/app/graphql-queries/hypercerts";
import { catchError } from "@/app/utils";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/types/api";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import CreatorAddress from "./components/creator-address";
import FundingProgressView from "./components/funding-progress-view";
import { Separator } from "@/components/ui/separator";
import LeftContent from "./components/left-content";
import RightContent from "./components/right-content";
import { bigintToFormattedDate } from "@/lib/utils";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

type PageProps = {
  params: { hypercertId: string };
};

const Page = async ({ params }: PageProps) => {
  const { hypercertId } = params;
  const [error, hypercert] = await catchError<FullHypercert, ApiError>(
    fetchFullHypercertById(hypercertId)
  );

  if (error) {
    return (
      <PageError
        title="We couldn't load the hypercert data."
        body="Please try refreshing the page or check the URL."
      />
    );
  }

  return (
    <MotionWrapper
      type="main"
      className="flex flex-col items-center justify-start w-full"
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-6xl p-8 flex flex-col gap-2">
        <Link href={"/"}>
          <Button variant={"link"} className="gap-2 p-0">
            <ChevronLeft size={20} /> View all hypercerts
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row justify-start md:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">
              {hypercert.name ?? "Untitled"}
            </h1>
            <div className="text-muted-foreground text-sm inline-flex items-center flex-wrap">
              <span className="mr-1">Created by</span>{" "}
              <CreatorAddress address={hypercert.creatorAddress} />{" "}
              <span className="mx-1">on</span>{" "}
              {bigintToFormattedDate(hypercert.creationBlockTimestamp)}
            </div>
            <ul className="flex items-center gap-2 flex-wrap mt-2">
              {hypercert.work.scope?.map((scope, i) => (
                <li
                  key={i}
                  className="bg-muted text-foreground/80 py-1 px-3 rounded-full"
                >
                  {scope}
                </li>
              ))}
            </ul>
          </div>
          <FundingProgressView hypercert={hypercert} />
        </div>
        <div className="w-full hidden md:block md:mt-4">
          <Separator />
        </div>
        <section className="flex flex-col md:flex-row items-start mt-4 gap-4 md:gap-8">
          <LeftContent hypercert={hypercert} />
          <RightContent hypercert={hypercert} />
        </section>
      </div>
    </MotionWrapper>
  );
};

export default Page;
