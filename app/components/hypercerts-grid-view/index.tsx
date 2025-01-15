import {
	type Hypercert,
	fetchHypercerts,
} from "@/app/graphql-queries/hypercerts";
import { catchError } from "@/app/utils";
import { Button } from "@/components/ui/button";
import type { ApiError } from "@/types/api";
import { CircleAlert, RotateCw } from "lucide-react";
import Link from "next/link";
import PageError from "../shared/PageError";
import { GridView } from "./grid-view";

export async function HypercertsGridWrapper() {
	const [error, hypercerts] = await catchError<Hypercert[], ApiError>(
		fetchHypercerts(),
	);

	if (error) return <PageError title="We couldn't load hypercerts." />;

	return <GridView hypercerts={hypercerts} />;
}
