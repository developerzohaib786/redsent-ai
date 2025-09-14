import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/post";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// GET single product by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                error: "Invalid product ID"
            }, { status: 400 });
        }

        await connectToDatabase();
        
        const product = await Product.findById(id).lean();

        if (!product) {
            return NextResponse.json({
                error: "Product not found"
            }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({
            error: "Failed to fetch product"
        }, { status: 500 });
    }
}