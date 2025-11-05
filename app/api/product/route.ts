import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = 'http://localhost:8001/api/web/v1/product'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");

  try {
    const response = await axios.get(BASE_URL, { params: { product_id } });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const response = await axios.post(BASE_URL, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const response = await axios.put(BASE_URL, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}
