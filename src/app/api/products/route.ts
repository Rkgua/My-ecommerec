import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface ProductCreateInput {
  name: string;
  description?: string;
  price: number | string;
  stock: number | string;
  images?: string[];
  categoryId: string;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      stock,
      images,
      categoryId,
    }: ProductCreateInput = body;

    if (!name || price === undefined || stock === undefined || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, price, stock, or categoryId',
        },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: typeof price === 'string' ? parseFloat(price) : price,
        stock: typeof stock === 'string' ? parseInt(stock, 10) : stock,
        images: images || [],
        category: { connect: { id: categoryId } },
      },
      include: { category: true },
    });

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: 'Product created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);

    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string; message?: string };

      if (prismaError.code === 'P2003') {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid categoryId. The specified category does not exist.',
          },
          { status: 400 }
        );
      }
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: 'A product with this name already exists.' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
