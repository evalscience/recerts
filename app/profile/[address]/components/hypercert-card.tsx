"use client";
import { Badge } from "@/components/ui/badge";

import { bigintToFormattedDate, cn } from "@/lib/utils";
import { Fraction } from "@/app/graphql-queries/user-fractions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowUpRight, CalendarRange, Loader2, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Hypercert } from "@/app/graphql-queries/hypercerts";

function HypercertCard({ hypercert }: { hypercert: Hypercert }) {
  const { hypercertId, name, description, image } = hypercert;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border flex flex-col">
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
        <p
          className={`line-clamp-2 max-h-12 flex-1 text-ellipsis font-semibold ${
            name ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {name ?? "[Untitled]"}
        </p>
        <p
          className={`line-clamp-2 max-h-12 flex-1 text-ellipsis text-muted-foreground`}
        >
          {description ?? "..."}
        </p>
      </section>
    </article>
  );
}

export default HypercertCard;
