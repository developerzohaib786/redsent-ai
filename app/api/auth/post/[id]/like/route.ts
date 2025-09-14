import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/post";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import crypto from "crypto";

// Helper function to generate browser fingerprint
function generateBrowserFingerprint(request: NextRequest): string {
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const realIp = request.headers.get('x-real-ip') || '';
    
    // Create a unique fingerprint based on request headers
    const fingerprint = crypto
        .createHash('sha256')
        .update(`${userAgent}|${acceptLanguage}|${acceptEncoding}|${forwardedFor}|${realIp}`)
        .digest('hex')
        .substring(0, 16); // Use first 16 characters for shorter ID
    
    return fingerprint;
}

// POST - Toggle like for a product (both authenticated and anonymous users)
export async function POST(
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

        // Get session to check if user is authenticated
        const session = await getServerSession(authOptions);
        
        await connectToDatabase();
        
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({
                error: "Product not found"
            }, { status: 404 });
        }

        // Initialize new fields if they don't exist
        if (product.anonymousLikeCount === undefined) {
            product.anonymousLikeCount = 0;
        }
        if (!product.anonymousLikedBy) {
            product.anonymousLikedBy = [];
        }

        let hasLiked = false;
        let isAuthenticated = false;

        if (session?.user?.id) {
            // Handle authenticated user
            isAuthenticated = true;
            const userId = new mongoose.Types.ObjectId(session.user.id);
            hasLiked = product.likedBy.includes(userId);

            if (hasLiked) {
                // Unlike the product
                product.likedBy = product.likedBy.filter(
                    (likedUserId: mongoose.Types.ObjectId) => !likedUserId.equals(userId)
                );
                product.likeCount = Math.max(0, product.likeCount - 1);
            } else {
                // Like the product
                product.likedBy.push(userId);
                product.likeCount += 1;
            }
        } else {
            // Handle anonymous user
            const browserFingerprint = generateBrowserFingerprint(request);
            hasLiked = product.anonymousLikedBy.includes(browserFingerprint);

            if (hasLiked) {
                // Unlike the product
                product.anonymousLikedBy = product.anonymousLikedBy.filter(
                    (fp: string) => fp !== browserFingerprint
                );
                product.anonymousLikeCount = Math.max(0, product.anonymousLikeCount - 1);
            } else {
                // Like the product
                product.anonymousLikedBy.push(browserFingerprint);
                product.anonymousLikeCount += 1;
            }
        }

        await product.save();

        // Calculate total likes (authenticated + anonymous)
        const totalLikeCount = product.likeCount + product.anonymousLikeCount;

        return NextResponse.json({
            success: true,
            liked: !hasLiked,
            likeCount: totalLikeCount,
            isAuthenticated,
            message: hasLiked ? "Product unliked" : "Product liked"
        }, { status: 200 });

    } catch (error) {
        console.error('Error toggling like:', error);
        return NextResponse.json({
            error: "Failed to toggle like"
        }, { status: 500 });
    }
}

// GET - Check if user has liked the product (both authenticated and anonymous users)
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

        // Get session to check if user is authenticated
        const session = await getServerSession(authOptions);

        await connectToDatabase();
        
        const product = await Product.findById(id).select('likeCount likedBy anonymousLikeCount anonymousLikedBy');

        if (!product) {
            return NextResponse.json({
                error: "Product not found"
            }, { status: 404 });
        }

        // Initialize new fields if they don't exist
        if (product.anonymousLikeCount === undefined) {
            product.anonymousLikeCount = 0;
        }
        if (!product.anonymousLikedBy) {
            product.anonymousLikedBy = [];
        }

        let userHasLiked = false;
        let isAuthenticated = false;

        if (session?.user?.id) {
            // Check authenticated user
            isAuthenticated = true;
            const userId = new mongoose.Types.ObjectId(session.user.id);
            userHasLiked = product.likedBy.includes(userId);
        } else {
            // Check anonymous user
            const browserFingerprint = generateBrowserFingerprint(request);
            userHasLiked = product.anonymousLikedBy.includes(browserFingerprint);
        }

        // Calculate total likes (authenticated + anonymous)
        const totalLikeCount = product.likeCount + product.anonymousLikeCount;

        return NextResponse.json({
            likeCount: totalLikeCount,
            userHasLiked: userHasLiked,
            isAuthenticated: isAuthenticated,
            authenticatedLikes: product.likeCount,
            anonymousLikes: product.anonymousLikeCount
        }, { status: 200 });

    } catch (error) {
        console.error('Error checking like status:', error);
        return NextResponse.json({
            error: "Failed to check like status"
        }, { status: 500 });
    }
}