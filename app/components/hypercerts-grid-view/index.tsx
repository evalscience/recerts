import { fetchHypercerts, Hypercert } from "@/app/graphql-queries/hypercerts";
import { catchError } from "@/app/utils";
import { ApiError } from "@/types/api";
import { GridView } from "./grid-view";
import { CircleAlert, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageError from "../PageError";

export async function HypercertsGridWrapper() {
  const [error, hypercerts] = await catchError<Hypercert[], ApiError>(
    fetchHypercerts()
  );

  if (error) return <PageError title="We couldn't load hypercerts." />;

  return <GridView hypercerts={hypercerts} />;
}
