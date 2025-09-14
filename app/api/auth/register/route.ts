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

    } catch (error: any) {
        console.error("User Registration Error: ", error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return NextResponse.json({
                error: "User with this email already exists"
            }, { status: 400 });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return NextResponse.json({
                error: "Invalid input data",
                details: error.message
            }, { status: 400 });
        }

        // Generic error response
        return NextResponse.json({
            error: "Internal server error during registration"
        }, { status: 500 });
    }
}