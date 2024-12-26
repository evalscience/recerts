"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  bigintToFormattedDate,
  cn,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { Fraction } from "@/app/graphql-queries/user-fractions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowUpRight, CalendarRange, Loader2, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchFullHypercertById,
  Hypercert,
} from "@/app/graphql-queries/hypercerts";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";

function FractionCard({ fraction }: { fraction: Fraction }) {
  const { hypercertId, name, description, image, work, units } = fraction;

  const [hypercert, setHypercert] = useState<Hypercert | undefined>();
  useEffect(() => {
    if (hypercertId === undefined) return;
    fetchFullHypercertById(hypercertId).then((hypercert) => {
      setHypercert(hypercert);
    });
  }, [hypercertId]);

  const percentageFractionBought = calculateBigIntPercentage(
    units,
    hypercert?.totalUnits
  );
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border flex flex-col">
      {units !== undefined &&
        (hypercert ? (
          percentageFractionBought === undefined ||
          hypercert.pricePerPercentInUSD === undefined ? null : (
            <div className="bg-background py-2 px-4 flex items-center justify-center text-center">
              <span className="font-bold text-primary mx-6">
                ${percentageFractionBought * hypercert.pricePerPercentInUSD}
              </span>
            </div>
          )
        ) : (
          <div className="bg-background py-2 px-4 flex items-center justify-center text-center gap-2">
            <Loader2 size={18} className="animate-spin text-primary" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ))}

      <div className="relative h-[200px] w-full bg-muted flex items-start justify-center p-4 overflow-hidden rounded-t-2xl">
        <Image
          // src={`/api/hypercerts/${hypercert_id}/image`}
          src={image ?? ""}
          alt={name ?? "Untitled"}
          height={200}
          width={200}
          className="w-full h-auto group-hover:scale-[1.05] group-hover:blur-sm group-hover:brightness-75 transition"
        />
        {hypercertId !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Link href={`/hypercerts/${hypercertId}`} target="_blank" passHref>
              <Button variant={"secondary"} className="gap-2">
                View Hypercert <ArrowUpRight size={20} />
              </Button>
            </Link>
          </div>
        )}
      </div>
      <section
        className="flex-1 w-full space-y-2 p-4 bg-background/90 border-t border-t-border backdrop-blur-md"
        style={{
          boxShadow: "0 -10px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-wrap gap-1">
          {work.scope?.map((scope) => (
            <Badge
              key={scope}
              variant="secondary"
              className={cn("items-center justify-between rounded-3xl")}
            >
              <p className="ml-1 font-light text-xs">{scope}</p>
            </Badge>
          ))}
        </div>
        <p
          className={`line-clamp-2 max-h-12 flex-1 text-ellipsis font-semibold ${
            name ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {name ?? "[Untitled]"}
        </p>
        {work.from !== undefined && work.to !== undefined && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarRange className="" size={16} />
            {work.from !== undefined && (
              <time
                className="text-sm text-vd-blue-400"
                dateTime={bigintToFormattedDate(work.from)}
              >
                {bigintToFormattedDate(work.from)}
              </time>
            )}
            <span className="text-sm text-vd-blue-400"> - </span>
            {work.to !== undefined && (
              <time
                className="text-sm text-vd-blue-400"
                dateTime={bigintToFormattedDate(work.to)}
              >
                {bigintToFormattedDate(work.to)}
              </time>
            )}
          </div>
        )}
        <p
          className={`line-clamp-2 max-h-12 flex-1 text-ellipsis text-muted-foreground`}
        >
          {description ?? "..."}
        </p>
      </section>
    </article>
  );
}

export default FractionCard;
