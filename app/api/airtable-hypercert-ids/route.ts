import { hyperboardId } from "@/config/hypercerts";
import {
	fetchHypercertsGraphQL as fetchGraphQL,
	graphql,
} from "@/graphql/hypercerts";
import {
	type AirtableRecord,
	createAirtableRecordForHypercertId,
	fetchAllAirtableRecordsForDebug,
	fetchApprovedHypercertIdsFromAirtable,
	fetchApprovedHypercertStatusesFromAirtable,
} from "@/lib/airtable";
import { tryCatch } from "@/lib/tryCatch";
import { NextResponse } from "next/server";

const hypercertIdsByHyperboardIdQuery = graphql(`
  query GetHypercertIdsByHyperboardId($hyperboard_id: String!) {
    hyperboards(where: { id: { eq: $hyperboard_id } }) {
      data {
        sections {
          data {
            entries {
              id
            }
          }
        }
      }
    }
  }
`);

const fetchHypercertIDsFromHyperboard = async (): Promise<string[]> => {
	const [response, error] = await tryCatch(() =>
		fetchGraphQL(hypercertIdsByHyperboardIdQuery, {
			hyperboard_id: hyperboardId,
		}),
	);
	if (error) {
		console.error("Failed to fetch from hyperboard:", error);
		return [];
	}

	const hyperboard = response.hyperboards.data?.[0];
	if (!hyperboard || !hyperboard.sections.data) return [];

	const ids: string[] = [];
	for (const section of hyperboard.sections.data) {
		for (const entry of section.entries) {
			ids.push(entry.id);
		}
	}
	return ids;
};

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const debug = searchParams.get("debug") === "1";

		let ids: string[] = [];
		let usedFallback = false;

		try {
			ids = await fetchApprovedHypercertIdsFromAirtable();
		} catch (airtableError) {
			console.warn(
				"Airtable failed, using hyperboard fallback:",
				airtableError,
			);
			ids = await fetchHypercertIDsFromHyperboard();
			usedFallback = true;
		}

		if (!debug) return NextResponse.json({ ids, usedFallback });

		// Minimal debug info to validate field names without exposing secrets
		let sample: AirtableRecord[] = [];
		let statuses: Record<string, "Under review" | "Reviewed"> = {};

		if (!usedFallback) {
			try {
				sample = await fetchAllAirtableRecordsForDebug();
				statuses = await fetchApprovedHypercertStatusesFromAirtable();
			} catch (debugError) {
				console.warn("Debug fetch failed:", debugError);
			}
		}

		return NextResponse.json({
			ids,
			statuses,
			usedFallback,
			meta: { count: ids.length, sample: sample.slice(0, 3) },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as {
			hypercertId?: string;
			fields?: Record<string, unknown>;
		};
		const hypercertId = (body.hypercertId ?? "").trim();
		if (!hypercertId) {
			return NextResponse.json(
				{ error: "Missing hypercertId" },
				{ status: 400 },
			);
		}
		const record = await createAirtableRecordForHypercertId(
			hypercertId,
			body.fields,
		);
		return NextResponse.json({ record });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
