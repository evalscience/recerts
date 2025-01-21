import { HYPERCERTS_API_URL } from "@/config/graphql";
import {
	getHyperboardsByIdQuery,
	getHypercertsByHypercertIdQuery,
} from "@/graphql/queries";
import request from "graphql-request";

export const fetchHypercerts = async () => {
	try {
		const res = await request(HYPERCERTS_API_URL, getHyperboardsByIdQuery, {
			id: process.env.HYPERBOARD_ID,
		});
		// const hypercertIds = await getHypercertIds();
		const hypercertIds =
			res.hyperboards?.data?.[0]?.sections?.data?.[0]?.entries.map(
				(entry) => entry.id,
			);
		if (!hypercertIds) {
			const errorMessage = "No hypercert IDs found (status code: 404)";
			throw new Error(errorMessage);
		}

		const hypercertPromises = hypercertIds.map((hypercertId) =>
			request(HYPERCERTS_API_URL, getHypercertsByHypercertIdQuery, {
				hypercert_id: hypercertId,
			}),
		);
		const hypercertsData = await Promise.all(hypercertPromises);
		// Extract data from the first index of each hypercerts.data
		const hypercerts = hypercertsData.map(
			(hypercert) => hypercert?.hypercerts?.data?.[0] || null,
		);

		return {
			data: hypercerts.filter((hypercert) => hypercert != null),
		};
	} catch (error) {
		return {
			error: error as Error,
		};
	}
};
