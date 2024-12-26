import type { Hypercert } from "@/app/profile/[address]/page";
import EmptyHistory from "@/assets/history-bg.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { HistoryCard } from "./fraction-card";
import { Fraction } from "@/app/graphql-queries/user-fractions";

// TODO: Replace mockData with actual data from the API,
const History = ({
  hypercerts,
  fractions,
}: {
  hypercerts: Hypercert[];
  fractions: Fraction[];
}) => {
  const renderHypercertProfileCards = () => {
    return hypercerts.map((hypercert) => {
      // <HistoryCard
      // 	key={hypercert.hypercert_id}
      // 	id={hypercert.hypercert_id}
      // 	units={hypercert.units}
      // 	hypercert_id={hypercert.hypercert_id}
      // 	owner_address={hypercert.creator_address}
      // 	image={hypercert.metadata.image}
      // 	name={hypercert.metadata.name}
      // 	description={hypercert.metadata.description}
      // 	work_timeframe_from={hypercert.metadata.work_timeframe_from}
      // 	work_timeframe_to={hypercert.metadata.work_timeframe_to}
      // 	work_scope={hypercert.metadata.work_scope}
      // 	contributors={hypercert.metadata.contributors}
      // 	external_url={""}
      // />
      return null;
    });
  };

  const renderHypercertsEmptyState = () => {
    return (
      <div className="flex flex-col gap-6 pt-6 text-center md:px-20">
        <EmptyHistory className="text-stone-200" />
        <p className="px-8 text-stone-600">
          When you create Hypercerts they will appear here.
        </p>
      </div>
    );
  };

  const renderFractionProfileCards = () => {
    return fractions.map((fraction) => {
      if (fraction.fractionId === undefined) return null;
      return <HistoryCard key={fraction.id} fraction={fraction} />;
    });
  };

  const renderFractionsEmptyState = () => {
    return (
      <div className="flex flex-col gap-6 pt-6 text-center md:px-20">
        <EmptyHistory className="text-stone-200" />
        <p className="px-8 text-stone-600">
          When you start supporting different causes they will appear here.
        </p>
      </div>
    );
  };

  return (
    <section className="flex flex-col gap-4 md:col-span-2 md:col-start-1 md:mt-2">
      <h2 className="text-center font-semibold text-xl md:py-6 md:text-left md:text-3xl">
        History
      </h2>
      <Tabs defaultValue="hypercerts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hypercerts">My Hypercerts</TabsTrigger>
          <TabsTrigger value="fractions">My Contributions</TabsTrigger>
        </TabsList>
        <TabsContent value="hypercerts" className="flex flex-col gap-2">
          {hypercerts && hypercerts.length > 0
            ? renderHypercertProfileCards()
            : renderHypercertsEmptyState()}
        </TabsContent>
        <TabsContent value="fractions" className="flex flex-col gap-2">
          {fractions && fractions.length > 0
            ? renderFractionProfileCards()
            : renderFractionsEmptyState()}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default History;
