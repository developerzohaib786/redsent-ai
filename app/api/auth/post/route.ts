import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb"
import Product, { IProduct } from "@/models/post";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose"; 

// ----- GET All POSTs API ----- >

export async function GET() {
    try {
        await connectToDatabase();
        const products = await Product.find().sort({ createdAt: -1 }).lean();

        if (!products || products.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({
            error: "Failed to fetch products"
        }, { status: 500 });
    }
}

// ----- Add New POST API ----- >

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                error: 'Unauthorized action'
            }, { status: 401 });
        }

        await connectToDatabase();
        const body: IProduct = await request.json();

        // Validate required fields
        if (
            !body.productTitle ||
            !body.productDescription ||
            !body.productPrice ||
            !body.affiliateLink ||
            !body.affiliateLinkText
        ) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 });
        }

        // Validate pros and cons arrays
        const validPros = body.pros?.filter(pro => pro.trim().length > 0) || [];
        const validCons = body.cons?.filter(con => con.trim().length > 0) || [];

        if (validPros.length === 0) {
            return NextResponse.json({
                error: 'At least one pro is required'
            }, { status: 400 });
        }

        if (validCons.length === 0) {
            return NextResponse.json({
                error: 'At least one con is required'
            }, { status: 400 });
        }

        // Validate Reddit reviews (all required fields and URL)
        const validReviews = (body.redditReviews || []).filter(review =>
            review &&
            typeof review.comment === 'string' && review.comment.trim().length > 0 &&
            typeof review.tag === 'string' && ['positive', 'negative', 'neutral'].includes(review.tag) &&
            typeof review.link === 'string' && review.link.trim().length > 0 &&
            typeof review.author === 'string' && review.author.trim().length > 0 &&
            typeof review.subreddit === 'string' && review.subreddit.trim().length > 0
        );

        for (const review of validReviews) {
            if (review.link && review.link.trim() !== '') {
                try {
                    new URL(review.link);
                } catch {
                    return NextResponse.json({
                        error: 'Invalid Reddit review URL format'
                    }, { status: 400 });
                }
            }
        }

        // Prepare product data
        const productData: Partial<IProduct> = {
            productTitle: body.productTitle.trim(),
            productDescription: body.productDescription.trim(),
            productPhotos: body.productPhotos?.filter(photo => photo.trim() !== '') || [],
            productPrice: body.productPrice.trim(),
            affiliateLink: body.affiliateLink.trim(),
            affiliateLinkText: body.affiliateLinkText.trim(),
            pros: validPros,
            cons: validCons,
            redditReviews: validReviews,
            productScore: body.productScore ?? 50
        };

        const newProduct = await Product.create(productData);
        return NextResponse.json(newProduct, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);

        // Handle mongoose validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.message
            }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Failed to create product'
        }, { status: 500 });
    }
}

// ----- Update POST API ----- >

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                error: 'Unauthorized action'
            }, { status: 401 });
        }

        await connectToDatabase();
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({
                error: 'Product ID is required'
            }, { status: 400 });
        }

        // Validate required fields
        if (
            !updateData.productTitle ||
            !updateData.productDescription ||
            !updateData.productPrice ||
            !updateData.affiliateLink ||
            !updateData.affiliateLinkText
        ) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 });
        }

        // Validate pros and cons arrays
        const validPros = updateData.pros?.filter((pro: string) => pro.trim().length > 0) || [];
        const validCons = updateData.cons?.filter((con: string) => con.trim().length > 0) || [];

        if (validPros.length === 0) {
            return NextResponse.json({
                error: 'At least one pro is required'
            }, { status: 400 });
        }

        if (validCons.length === 0) {
            return NextResponse.json({
                error: 'At least one con is required'
            }, { status: 400 });
        }

        // Prepare update data
        const productUpdateData = {
            productTitle: updateData.productTitle.trim(),
            productDescription: updateData.productDescription.trim(),
            productPhotos: updateData.productPhotos?.filter((photo: string) => photo.trim() !== '') || [],
            productPrice: updateData.productPrice.trim(),
            affiliateLink: updateData.affiliateLink.trim(),
            affiliateLinkText: updateData.affiliateLinkText.trim(),
            pros: validPros,
            cons: validCons,
            redditReviews: updateData.redditReviews || [],
            productScore: updateData.productScore ?? 50
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            productUpdateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({
                error: 'Product not found'
            }, { status: 404 });
        }

        return NextResponse.json(updatedProduct, { status: 200 });

    } catch (error) {
        console.error('Error updating product:', error);

        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.message
            }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Failed to update product'
        }, { status: 500 });
    }
}

// ----- Delete POST API ----- >
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                error: 'Unauthorized action'
            }, { status: 401 });
        }

        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        console.log('Delete request received for ID:', id); // Debug log

        if (!id) {
            return NextResponse.json({
                error: 'Product ID is required'
            }, { status: 400 });
        }

        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                error: 'Invalid product ID format'
            }, { status: 400 });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({
                error: 'Product not found'
            }, { status: 404 });
        }

        console.log('Product deleted successfully:', deletedProduct._id); // Debug log

        return NextResponse.json({
            message: 'Product deleted successfully',
            deletedProduct
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({
            error: 'Failed to delete product',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}