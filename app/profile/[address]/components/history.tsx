import EmptyHistory from "@/assets/history-bg.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FractionCard from "./fraction-card";
import { Fraction } from "@/app/graphql-queries/user-fractions";
import CardGridWrapper from "./card-grid-wrapper";
import { Hypercert } from "@/app/graphql-queries/hypercerts";
import HypercertCard from "./hypercert-card";

const NoFractions = () => {
  return (
    <div className="flex flex-col gap-6 pt-6 text-center md:px-20">
      <EmptyHistory className="text-stone-200" />
      <p className="px-8 text-stone-600">
        When you start supporting different causes they will appear here.
      </p>
    </div>
  );
};

const NoHypercerts = () => {
  return (
    <div className="flex flex-col gap-6 pt-6 text-center md:px-20">
      <EmptyHistory className="text-stone-200" />
      <p className="px-8 text-stone-600">
        When you create Hypercerts they will appear here.
      </p>
    </div>
  );
};
// TODO: Replace mockData with actual data from the API,
const History = ({
  hypercerts,
  fractions,
}: {
  hypercerts: Hypercert[];
  fractions: Fraction[];
}) => {
  console.log("hypercerts", hypercerts);

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
          {hypercerts && hypercerts.length > 0 ? (
            <CardGridWrapper>
              {hypercerts.map((hypercert) => {
                return (
                  <HypercertCard
                    key={hypercert.hypercertId}
                    hypercert={hypercert}
                  />
                );
              })}
            </CardGridWrapper>
          ) : (
            <NoHypercerts />
          )}
        </TabsContent>
        <TabsContent value="fractions" className="flex flex-col gap-2">
          {fractions && fractions.length > 0 ? (
            <CardGridWrapper>
              {fractions.map((fraction) => {
                if (fraction.fractionId === undefined) return null;
                return <FractionCard key={fraction.id} fraction={fraction} />;
              })}
            </CardGridWrapper>
          ) : (
            <NoFractions />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default History;
