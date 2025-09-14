import mongoose, { Schema, model, models } from "mongoose";

export interface IRedditReview {
    review: string;
    visitLink: string;
    tag: 'positive' | 'negative' | 'neutral';
}

export interface IProduct {
    _id?: mongoose.Types.ObjectId;
    productTitle: string;
    productDescription: string;
    productPhotos: string[];
    productPrice: string;
    affiliateLink: string;
    affiliateLinkText: string;
    pros: string[];
    cons: string[];
    redditReviews: IRedditReview[];
    productScore: number;
    likeCount: number;
    likedBy: mongoose.Types.ObjectId[];
    anonymousLikeCount: number;
    anonymousLikedBy: string[]; // Store browser fingerprints or session IDs
    createdAt?: Date;
    updatedAt?: Date;
}

const redditReviewSchema = new Schema({
    review: { type: String, required: true },
    visitLink: { type: String, required: true },
    tag: { 
        type: String, 
        enum: ['positive', 'negative', 'neutral'], 
        default: 'neutral' 
    }
}, { _id: false });

const productSchema = new Schema({
    productTitle: { 
        type: String, 
        required: true, 
        minlength: 3, 
        maxlength: 100 
    },
    productDescription: { 
        type: String, 
        required: true, 
        minlength: 10, 
        maxlength: 2000 
    },
    productPhotos: { 
        type: [String], 
        default: [],
        validate: {
            validator: function(arr: string[]) {
                return arr.length <= 5;
            },
            message: 'Maximum 5 photos allowed'
        }
    },
    productPrice: { 
        type: String, 
        required: true,
        validate: {
            validator: function(price: string) {
                return /^\$?\d+(\.\d{2})?$/.test(price.trim());
            },
            message: 'Invalid price format'
        }
    },
    affiliateLink: { 
        type: String, 
        required: true,
        validate: {
            validator: function(url: string) {
                try {
                    new URL(url);
                    return true;
                } catch {
                    return false;
                }
            },
            message: 'Invalid URL format'
        }
    },
    affiliateLinkText: { 
        type: String, 
        required: true, 
        maxlength: 50 
    },
    pros: { 
        type: [String], 
        required: true,
        validate: {
            validator: function(arr: string[]) {
                return arr.length > 0 && arr.some(pro => pro.trim().length > 0);
            },
            message: 'At least one pro is required'
        }
    },
    cons: { 
        type: [String], 
        required: true,
        validate: {
            validator: function(arr: string[]) {
                return arr.length > 0 && arr.some(con => con.trim().length > 0);
            },
            message: 'At least one con is required'
        }
    },
    redditReviews: { 
        type: [redditReviewSchema], 
        default: [],
        validate: {
            validator: function(arr: IRedditReview[]) {
                return arr.length <= 10;
            },
            message: 'Maximum 10 Reddit reviews allowed'
        }
    },
    productScore: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100,
        default: 50
    },
    likeCount: {
        type: Number,
        default: 0,
        min: 0
    },
    likedBy: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    anonymousLikeCount: {
        type: Number,
        default: 0,
        min: 0
    },
    anonymousLikedBy: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const Product = models?.Product || model("Product", productSchema);

export default Product;