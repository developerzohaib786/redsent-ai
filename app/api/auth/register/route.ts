import { connectToDatabase } from "@/lib/mongodb";
import User from '@/models/user';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password, bio, profileImageURL, Name } = await request.json();

        if (!email || !password) {
            console.log('Body is missing Name, email, password, or Biography');
            return NextResponse.json({
                error: "Email and password are required!"
            }, { status: 400 });
        }

        await connectToDatabase();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('User already exists');
            return NextResponse.json({
                error: 'User already exists!'
            }, { status: 400 });
        }

        const newUser = await User.create({
            email, 
            password, 
            bio: bio || '', 
            profileImageURL: profileImageURL || '', 
            Name: Name || ''
        });

        console.log('User created successfully');
        return NextResponse.json({
            message: "User registration was successful",
            user: {
                id: newUser._id,
                email: newUser.email,
                Name: newUser.Name
            }
        }, { status: 201 });

    } catch (error: unknown) {
        console.error("User Registration Error: ", error);

        // Narrow the unknown error to an object so we can safely access properties
        if (typeof error === 'object' && error !== null) {
            // Using a generic unknown-record and narrow fields safely
            const errObj = error as Record<string, unknown>;

            // Handle specific MongoDB duplicate key error (code 11000)
            if (typeof errObj.code === 'number' && errObj.code === 11000) {
                return NextResponse.json({
                    error: "User with this email already exists"
                }, { status: 400 });
            }

            // Handle Mongoose validation errors
            if (typeof errObj.name === 'string' && errObj.name === 'ValidationError') {
                const details = typeof errObj.message === 'string' ? errObj.message : String(errObj.message ?? '');
                return NextResponse.json({
                    error: "Invalid input data",
                    details
                }, { status: 400 });
            }
        }

        // Generic error response for unknown/error types
        return NextResponse.json({
            error: "Internal server error during registration"
        }, { status: 500 });
    }
}