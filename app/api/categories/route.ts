// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

// GET - Fetch all categories
export async function GET() {
    try {
        await connectToDatabase();
        const categories = await Category.find({}).sort({ createdAt: -1 });
        return NextResponse.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST - Create new category
export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { name, image } = body;

        // Validation
        if (!name || !image || !image.url || !image.fileId || !image.name) {
            return NextResponse.json(
                { success: false, error: 'Name and complete image data are required' },
                { status: 400 }
            );
        }

        // Check if category with same name already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return NextResponse.json(
                { success: false, error: 'Category with this name already exists' },
                { status: 409 }
            );
        }

        const category = new Category({
            name: name.trim(),
            image: {
                url: image.url,
                fileId: image.fileId,
                name: image.name
            }
        });

        await category.save();

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Category created successfully'
        }, { status: 201 });

    } catch (error: unknown) {
        console.error('Error creating category:', error);

        // Type guard for MongoError
        if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: number }).code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Category name must be unique' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to create category' },
            { status: 500 }
        );
    }
}