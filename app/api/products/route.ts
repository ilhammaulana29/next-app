import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    if (params.limit) {
      params.per_page = params.limit;
      delete params.limit;
    }

    const response = await axios.get("http://localhost:8001/api/web/v1/products", {
      params,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
