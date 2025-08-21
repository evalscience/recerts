export type AirtableRecord = {
	id: string;
	fields: Record<string, unknown>;
};

const AIRTABLE_BASE_ID = "appXzwMjwchAnI4ne";
const AIRTABLE_TABLE_ID = "tbl2XnoBojkPbDa1b";
const AIRTABLE_VIEW_ID = "viw056zHiXfmCqGVF";

export async function fetchAllAirtableRecordsForDebug(): Promise<
	AirtableRecord[]
> {
	const token = process.env.AIRTABLE_TOKEN;
	if (!token) {
		throw new Error("Missing AIRTABLE_TOKEN env var");
	}

	const records: AirtableRecord[] = [];
	let offset: string | undefined = undefined;

	do {
		const searchParams = new URLSearchParams({
			view: AIRTABLE_VIEW_ID,
			...(offset ? { offset } : {}),
		});
		const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?${searchParams.toString()}`;
		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Airtable error ${res.status}: ${text}`);
		}
		const json = (await res.json()) as {
			records: AirtableRecord[];
			offset?: string;
		};
		records.push(...json.records);
		offset = json.offset;
	} while (offset);

	return records;
}

export async function fetchApprovedHypercertIdsFromAirtable(): Promise<
	string[]
> {
	const records = await fetchAllAirtableRecordsForDebug();
	const seen = new Set<string>();
	for (const record of records) {
		const statusField = (record.fields.Status ?? "") as string;
		const normalizedStatus = statusField.trim().toLowerCase();
		if (normalizedStatus === "awaiting approval") continue;

		const rawId = getFirstStringField(record.fields, [
			"Hypercert Id",
			"Hypercerts Id",
			"HypercertID",
			"HypercertsID",
		]);
		if (!rawId) continue;
		const normalizedId = normalizeHypercertId(rawId);
		if (!normalizedId) continue;
		seen.add(normalizedId);
	}
	return Array.from(seen);
}

function normalizeHypercertId(input: string): string | null {
	const trimmed = input.trim();
	if (!trimmed) return null;
	// Try to extract from within a longer string (e.g., pasted URL or note)
	const pattern = /(\d+)-0x[a-fA-F0-9]{40}-\d+/;
	const match = trimmed.match(pattern);
	if (match) return match[0];
	// If the entire string is the ID
	if (/^\d+-0x[a-fA-F0-9]{40}-\d+$/.test(trimmed)) return trimmed;
	return null;
}

function getFirstStringField(
	fields: Record<string, unknown>,
	candidateNames: string[],
): string | null {
	for (const name of candidateNames) {
		const val = fields[name];
		if (typeof val === "string" && val.trim().length > 0) return val;
	}
	return null;
}

export async function fetchApprovedHypercertStatusesFromAirtable(): Promise<
	Record<string, "Under review" | "Reviewed">
> {
	const records = await fetchAllAirtableRecordsForDebug();
	const result: Record<string, "Under review" | "Reviewed"> = {};
	for (const record of records) {
		const statusField = (record.fields.Status ?? "") as string;
		const normalizedStatus = statusField.trim().toLowerCase();
		if (normalizedStatus === "awaiting approval") continue;

		const rawId = getFirstStringField(record.fields, [
			"Hypercert Id",
			"Hypercerts Id",
			"HypercertID",
			"HypercertsID",
		]);
		if (!rawId) continue;
		const normalizedId = normalizeHypercertId(rawId);
		if (!normalizedId) continue;

		// Map Airtable statuses to UI labels
		const uiStatus =
			normalizedStatus === "reviewed" ? "Reviewed" : "Under review";
		result[normalizedId] = uiStatus;
	}
	return result;
}

export async function createAirtableRecordForHypercertId(
	hypercertId: string,
	extraFields?: Record<string, unknown>,
) {
	const body = {
		records: [
			{
				fields: {
					// Prefer singular key used in the base
					"Hypercert Id": hypercertId,
					Status: "Awaiting Approval",
					...(extraFields ?? {}),
				},
			},
		],
		typecast: true,
	};

	// If running on the client, call our API route to keep secrets server-side
	if (typeof window !== "undefined") {
		const res = await fetch("/api/airtable-hypercert-ids", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ hypercertId, fields: extraFields }),
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`API create error ${res.status}: ${text}`);
		}
		const json = (await res.json()) as { record: AirtableRecord };
		return json.record;
	}

	// Server-side: call Airtable directly
	const token = process.env.AIRTABLE_TOKEN;
	if (!token) throw new Error("Missing AIRTABLE_TOKEN env var");
	const res = await fetch(
		`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		},
	);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Airtable create error ${res.status}: ${text}`);
	}
	const json = (await res.json()) as { records: AirtableRecord[] };
	return json.records?.[0];
}
