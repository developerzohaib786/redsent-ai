import mongoose, { Schema, model, models } from "mongoose";

export interface IRedditReview {
    comment: string;
    tag: 'positive' | 'negative' | 'neutral';
    link: string;
    author: string;
    subreddit: string;
}

export interface ILikeDislikePoint {
    heading: string;
    points: string[];
}

export interface ILikesAndDislikes {
    likes: ILikeDislikePoint[];
    dislikes: ILikeDislikePoint[];
}

export interface IProduct {
    _id?: mongoose.Types.ObjectId;
    productTitle: string;
    productDescription: string;
    productPhotos: string[];
    productPrice: string;
    affiliateLink: string;
    affiliateLinkText: string;
    positiveReviewPercentage?: number;
    neutralReviewPercentage?: number;
    negativeReviewPercentage?: number;
    redditReviews: IRedditReview[];
    productScore: number;
    productRank?: number;
    category: string;
    likesAndDislikes?: ILikesAndDislikes;
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

const likeDislikePointSchema = new Schema({
    heading: { type: String, required: true },
    points: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr: string[]) {
                return arr.length >= 1 && arr.length <= 10;
            },
            message: 'Each category must have between 1 and 10 points'
        }
    }
}, { _id: false });

const likesAndDislikesSchema = new Schema({
    likes: {
        type: [likeDislikePointSchema],
        default: [],
        validate: {
            validator: function (arr: ILikeDislikePoint[]) {
                return arr.length <= 10;
            },
            message: 'Maximum 10 like categories allowed'
        }
    },
    dislikes: {
        type: [likeDislikePointSchema],
        default: [],
        validate: {
            validator: function (arr: ILikeDislikePoint[]) {
                return arr.length <= 10;
            },
            message: 'Maximum 10 dislike categories allowed'
        }
    }
}, { _id: false });

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
            validator: function (arr: string[]) {
                return arr.length <= 5;
            },
            message: 'Maximum 5 photos allowed'
        }
    },
    productPrice: {
        type: String,
        required: true,
        validate: {
            validator: function (price: string) {
                return /^\$?\d+(\.\d{2})?$/.test(price.trim());
            },
            message: 'Invalid price format'
        }
    },
    affiliateLink: {
        type: String,
        required: true,
        validate: {
            validator: function (url: string) {
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
    redditReviews: {
        type: [redditReviewSchema],
        default: []
    },
    positiveReviewPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    negativeReviewPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    neutralReviewPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    productScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 50
    },
    likesAndDislikes: {
        type: likesAndDislikesSchema,
        default: undefined
    }
}, { timestamps: true });

const Product = models?.Product || model("Product", productSchema);

export default Product;