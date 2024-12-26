import { Hypercert } from "@/app/graphql-queries/hypercerts";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { type SupportedChainIdType, supportedChains } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Progress from "../progress";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// * REFACTORED from hypercerts-app hypercert-window
const Card = ({ hypercert }: { hypercert: Hypercert }) => {
  const {
    hypercertId,
    name,
    description,
    image,
    totalUnits,
    unitsForSale,
    pricePerPercentInUSD,
    chainId,
  } = hypercert;

  const cardChain = supportedChains.find((x) => x.id === Number(chainId))?.name;
  const percentAvailable = calculateBigIntPercentage(unitsForSale, totalUnits);
  return (
    <Link href={`/hypercerts/${hypercertId}`} passHref>
      <article className="group relative overflow-hidden rounded-2xl bg-muted border border-border">
        <div className="h-[320px] w-full">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              // src={`/api/hypercerts/${hypercert_id}/image`}
              src={image ?? ""}
              alt={name ?? "Untitled"}
              fill
              sizes="300px"
              className="object-contain object-center w-full h-auto group-hover:scale-[1.05] transition"
            />
          </div>
        </div>
        <section className="absolute top-4 left-4 flex space-x-1 opacity-100 transition-opacity duration-150 ease-out group-hover:opacity-100 md:opacity-0">
          <div className="rounded-md border border-white/60 bg-black px-2 py-0.5 text-white text-xs shadow-sm">
            {cardChain}
          </div>
          <div className="rounded-md border border-black/60 bg-black px-2 py-0.5 text-white text-xs shadow-sm">
            approved
          </div>
        </section>
        <section
          className="absolute bottom-0 w-full space-y-2 p-4 bg-background/90 border-t border-t-border backdrop-blur-md"
          style={{
            boxShadow: "0 -10px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p
            className={`line-clamp-2 h-12 flex-1 text-ellipsis font-semibold ${
              name ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {name ?? "[Untitled]"}
          </p>
          <p
            className={`line-clamp-2 h-10 flex-1 text-ellipsis text-sm text-muted-foreground`}
          >
            {description ?? "..."}
          </p>
          {unitsForSale === undefined ? (
            <div className="w-full flex items-center justify-start text-muted-foreground text-sm">
              <span className="inline-block px-2 bg-destructive/20 text-destructive rounded-full">
                Coming Soon...
              </span>
            </div>
          ) : percentAvailable === undefined ||
            pricePerPercentInUSD === undefined ? (
            <div className="w-full flex items-center justify-start text-muted-foreground text-sm">
              <span className="inline-block px-2 bg-destructive/20 text-destructive rounded-full">
                Sold
              </span>
            </div>
          ) : (
            <>
              <Progress percentage={100 - percentAvailable} />
              <div className="w-full flex items-center justify-start text-muted-foreground text-sm">
                <span className="inline-block px-2 bg-primary/20 text-primary rounded-full">
                  ${(percentAvailable * pricePerPercentInUSD).toFixed(2)} left
                </span>
              </div>
            </>
          )}
        </section>
      </article>
    </Link>
  );
};

export default Card;
