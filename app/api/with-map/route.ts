import { unstable_cache } from "next/cache";
import type { NextRequest } from "next/server";

async function getData(sortOrder?: "asc" | "desc") {
	const data = ["apple", "banana", "cherry", "dragonfruit"];

  if (!sortOrder) return data;

	return sortOrder === "asc" ? data.sort() : data.sort().reverse();
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const sortOrder = (searchParams.get("sort") as "asc" | "desc") || "asc";

	// Create a Map to use as an argument
	const configMap = new Map([["sortOrder", sortOrder]]);

	const cachedData = unstable_cache(
		async (configMap: Map<string, string>) => {
			return getData(configMap.get("sortOrder") as "asc" | "desc");
		},
		["fruits-data"],
		{
			tags: ["fruits"],
		}
	);

	const result = await cachedData(configMap);

	return Response.json({ data: result });
}
