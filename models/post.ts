import mongoose, { Schema, model, models } from "mongoose";

export interface IRedditReview {
    comment: string;
    tag: 'positive' | 'negative' | 'neutral';
    link: string;
    author: string;
    subreddit: string;
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
    productRank?: number;
    category: string;
    likeCount: number;
    likedBy: string[];
    anonymousLikeCount: number;
    anonymousLikedBy: string[]; // Store browser fingerprints or session IDs
    createdAt?: Date;
    updatedAt?: Date;
}

const redditReviewSchema = new Schema({
    comment: { type: String, required: true },
    tag: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
        default: 'neutral'
    },
    link: { type: String, required: true },
    author: { type: String, required: true },
    subreddit: { type: String, required: true }
}, { _id: false });

const productCategories = [
    "Action Cameras",
    "Air Fryers",
    "Air Purifiers",
    "Camping Tents",
    "Dash Cams",
    "Drip Coffee Makers",
    "Drones",
    "Electric Coffee Grinders",
    "Electric Scooters",
    "Fitness Trackers",
    "Gaming Headsets",
    "Gaming Keyboards",
    "Gaming Mice",
    "Home Projectors",
    "IEMs",
    "Mesh Wifi Systems",
    "Outdoor Sleeping Bags",
    "Portable Air Conditioners",
    "Portable Bluetooth Speakers",
    "Portable Monitors",
    "Robot Vacuums",
    "Sleeping Pads",
    "Smart Doorbells",
    "Soundbars",
    "Trail Running Shoes",
    "Travel Car Seats",
    "Travel Strollers",
    "Ultrawide Monitors",
    "Vacuum Cleaners",
    "Webcams",
    "WiFi Routers",
    "Wireless Earbuds"
];

const productSchema = new Schema({
    productRank: {
        type: Number,
        min: 0,
        max: 100,
        default: undefined
    },
    category: {
        type: String,
        required: true,
        enum: productCategories
    },
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
        default: []
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
        type: [String],
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