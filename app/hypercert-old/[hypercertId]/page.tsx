import Image from "next/image";
import Link from "next/link";

import MapRenderer from "@/components/map-renderer";
import BuyFraction from "@/components/marketplace/buy-fraction";
import ReportSidebar, {
  type SidebarData,
} from "@/components/report-details/report-sidebar";
import { Separator } from "@/components/ui/separator";
import { getHypercertByHypercertId } from "@/hypercerts/getHypercertByHypercertId";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

interface ReportPageProps {
  params: { hypercertId: string };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { hypercertId } = params;
  const hypercertData = await getHypercertByHypercertId(hypercertId);

  if (hypercertData instanceof Error) {
    return <div>No hypercert found</div>;
  }

  if (!hypercertData || !hypercertData.metadata) {
    return <div>No hypercert data found</div>;
  }

  return (
    <main className="flex h-svh flex-col justify-between pt-6 md:h-fit md:px-12">
      {/* 192px is added to account for the funding progress on mobile */}
      <div className="flex flex-col gap-3 space-y-2 p-4 pb-[256px] md:mx-auto md:max-w-[1200px] md:pb-8">
        {!hypercertData.metadata ? (
          <section className="flex flex-1 flex-col gap-4">
            <Link href={"/"} className="group flex items-center space-x-1">
              <ChevronLeft
                size={24}
                className="group-hover:-translate-x-2 text-vd-blue-400 transition-transform duration-300 ease-in-out"
              />
              <p className="font-semibold text-sm text-vd-blue-500 uppercase tracking-wider">
                All contributions
              </p>
            </Link>
          </section>
        ) : (
          <>
            <section className="flex flex-1 flex-col gap-4">
              <Link href={"/"} className="group flex items-center space-x-1">
                <ChevronLeft
                  size={24}
                  className="group-hover:-translate-x-2 text-vd-blue-400 transition-transform duration-300 ease-in-out"
                />
                <p className="font-semibold text-sm text-vd-blue-500 uppercase tracking-wider">
                  All contributions
                </p>
              </Link>

              <h1 className="font-bold text-3xl tracking-tight md:text-4xl">
                {hypercertData.metadata.name}
              </h1>
            </section>
            <section className="flex flex-col gap-2 pt-2 md:flex-row md:gap-12">
              <section className="flex flex-col gap-4">
                {hypercertData.metadata.image && (
                  <CardContainer>
                    <CardBody className="rounded-xl shadow-xl">
                      <CardItem className="">
                        <Image
                          src={hypercertData.metadata.image}
                          alt="Report illustration"
                          width={300}
                          height={300}
                          className="w-full max-w-sm h-auto"
                        />
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                )}
                <div>
                  <h3 className="pb-3 font-bold text-2xl">Description</h3>
                  <p className="text-wrap leading-relaxed">
                    {hypercertData.metadata.description}
                  </p>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                  <BuyFraction hypercertId={hypercertId} />
                </Suspense>
              </section>
              {hypercertData.metadata && (
                <div>
                  <Separator className="my-6 block bg-stone-300 md:my-0 md:hidden" />
                  <ReportSidebar
                    metadata={hypercertData.metadata as SidebarData}
                    hypercert_id={hypercertId}
                    uri={hypercertData.uri ?? undefined}
                  />
                </div>
              )}
            </section>
          </>
        )}
        {/* {contributions && (
					<div>
						<Separator className="my-6 block bg-stone-300 md:hidden" />
						<ReportSupportFeed contributions={contributions} />
					</div>
				)}
					*/}
      </div>
    </main>
  );
}
