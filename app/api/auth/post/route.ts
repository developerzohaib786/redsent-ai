import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb"
import Product, { IProduct, ILikesAndDislikes, ILikeDislikePoint, IRedditReview } from "@/models/post";
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
            !body.affiliateLinkText ||
            !body.category
        ) {
            return NextResponse.json({
                error: 'Missing required fields'
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

        // Calculate review percentages
        const totalReviews = validReviews.length;
        const positiveCount = validReviews.filter(r => r.tag === 'positive').length;
        const negativeCount = validReviews.filter(r => r.tag === 'negative').length;
        const neutralCount = validReviews.filter(r => r.tag === 'neutral').length;
        const positiveReviewPercentage = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;
        const negativeReviewPercentage = totalReviews > 0 ? Math.round((negativeCount / totalReviews) * 100) : 0;
        const neutralReviewPercentage = totalReviews > 0 ? Math.round((neutralCount / totalReviews) * 100) : 0;

        // Validate likes and dislikes if provided
        let likesAndDislikes: ILikesAndDislikes | undefined = undefined;
        if (body.likesAndDislikes) {
            // Validate structure
            if (
                typeof body.likesAndDislikes === 'object' &&
                Array.isArray(body.likesAndDislikes.likes) &&
                Array.isArray(body.likesAndDislikes.dislikes)
            ) {
                // Validate each like category
                const validLikes = body.likesAndDislikes.likes.every(like =>
                    like &&
                    typeof like.heading === 'string' &&
                    like.heading.trim().length > 0 &&
                    Array.isArray(like.points) &&
                    like.points.length > 0 &&
                    like.points.every((point: string) => typeof point === 'string' && point.trim().length > 0)
                );

                // Validate each dislike category
                const validDislikes = body.likesAndDislikes.dislikes.every(dislike =>
                    dislike &&
                    typeof dislike.heading === 'string' &&
                    dislike.heading.trim().length > 0 &&
                    Array.isArray(dislike.points) &&
                    dislike.points.length > 0 &&
                    dislike.points.every((point: string) => typeof point === 'string' && point.trim().length > 0)
                );

                if (validLikes && validDislikes) {
                    likesAndDislikes = {
                        likes: body.likesAndDislikes.likes,
                        dislikes: body.likesAndDislikes.dislikes
                    };
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
            redditReviews: validReviews,
            productScore: body.productScore ?? 50,
            productRank: typeof body.productRank === 'number' ? body.productRank : undefined,
            category: body.category,
            positiveReviewPercentage,
            negativeReviewPercentage,
            neutralReviewPercentage,
            likesAndDislikes
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
            return NextResponse.json({ error: "Unauthorized action" }, { status: 401 });
        }

        await connectToDatabase();
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Calculate review percentages
        const reviews = updateData.redditReviews || [];
        const totalReviews = reviews.length;
        const positiveCount = reviews.filter((r: IRedditReview) => r.tag === 'positive').length;
        const negativeCount = reviews.filter((r: IRedditReview) => r.tag === 'negative').length;
        const neutralCount = reviews.filter((r: IRedditReview) => r.tag === 'neutral').length;
        const positiveReviewPercentage = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;
        const negativeReviewPercentage = totalReviews > 0 ? Math.round((negativeCount / totalReviews) * 100) : 0;
        const neutralReviewPercentage = totalReviews > 0 ? Math.round((neutralCount / totalReviews) * 100) : 0;

        // Validate and prepare likes and dislikes if provided
        let likesAndDislikes: ILikesAndDislikes | undefined = undefined;
        if (updateData.likesAndDislikes) {
            // Validate structure
            if (
                typeof updateData.likesAndDislikes === 'object' &&
                Array.isArray(updateData.likesAndDislikes.likes) &&
                Array.isArray(updateData.likesAndDislikes.dislikes)
            ) {
                // Validate each like category
                const validLikes = updateData.likesAndDislikes.likes.every((like: ILikeDislikePoint) =>
                    like &&
                    typeof like.heading === 'string' &&
                    like.heading.trim().length > 0 &&
                    Array.isArray(like.points) &&
                    like.points.length > 0 &&
                    like.points.every((point: string) => typeof point === 'string' && point.trim().length > 0)
                );

                // Validate each dislike category
                const validDislikes = updateData.likesAndDislikes.dislikes.every((dislike: ILikeDislikePoint) =>
                    dislike &&
                    typeof dislike.heading === 'string' &&
                    dislike.heading.trim().length > 0 &&
                    Array.isArray(dislike.points) &&
                    dislike.points.length > 0 &&
                    dislike.points.every((point: string) => typeof point === 'string' && point.trim().length > 0)
                );

                if (validLikes && validDislikes) {
                    likesAndDislikes = {
                        likes: updateData.likesAndDislikes.likes,
                        dislikes: updateData.likesAndDislikes.dislikes
                    };
                }
            }
        }

        // Prepare update data with schema alignment
        const productUpdateData: Partial<IProduct> = {
            productTitle: updateData.productTitle.trim(),
            productDescription: updateData.productDescription.trim(),
            productPhotos: updateData.productPhotos?.filter((photo: string) => photo.trim() !== "") || [],
            productPrice: updateData.productPrice.trim(),
            affiliateLink: updateData.affiliateLink.trim(),
            affiliateLinkText: updateData.affiliateLinkText.trim(),
            redditReviews: reviews,
            productScore: updateData.productScore ?? 50,
            productRank: updateData.productRank ?? undefined,
            category: updateData.category,
            positiveReviewPercentage,
            negativeReviewPercentage,
            neutralReviewPercentage
        };

        // Only add likesAndDislikes if it's defined
        if (likesAndDislikes !== undefined) {
            productUpdateData.likesAndDislikes = likesAndDislikes;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, productUpdateData, {
            new: true,
            runValidators: true
        });

        if (!updatedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error("Error updating product:", error);

        if (error instanceof Error && error.name === "ValidationError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
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