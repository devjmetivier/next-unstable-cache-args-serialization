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

	// Create an object to use as an argument
	const config = { sortOrder };

	const cachedData = await unstable_cache(
		async (config?: { sortOrder: "asc" | "desc" }) => {
			return getData(config?.sortOrder); 
		},
		["fruits-data"],
		{
			tags: ["fruits"],
		} ,
	);

	const result = await cachedData(config);

	return Response.json({ data: result });
}

