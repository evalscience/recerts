import { type NextRequest, NextResponse } from "next/server";
import { getHypercertImage } from "./get-hypercert-image";

// GET handler to fetch and return the image associated with the given hypercert ID
export async function GET(
	request: NextRequest,
	{ params }: { params: { "hypercert-id": string } },
) {
	const hypercertId = params["hypercert-id"];

	// Validate hypercert ID
	if (!hypercertId || Array.isArray(hypercertId)) {
		return new Response("Invalid ID", { status: 400 });
	}

	try {
		const { contentType, buffer } = await getHypercertImage(hypercertId);
		return new NextResponse(buffer, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "s-maxage=864000", // 10 days cache
			},
		});
	} catch (error) {
		return new Response("Error fetching image", { status: 500 });
	}
}
