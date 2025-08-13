import {
	createAirtableRecordForHypercertId,
	fetchAllAirtableRecordsForDebug,
	fetchApprovedHypercertIdsFromAirtable,
} from "@/lib/airtable";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const debug = searchParams.get("debug") === "1";
		const ids = await fetchApprovedHypercertIdsFromAirtable();
		if (!debug) return NextResponse.json({ ids });

		// Minimal debug info to validate field names without exposing secrets
		const sample = await fetchAllAirtableRecordsForDebug();
		return NextResponse.json({
			ids,
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
