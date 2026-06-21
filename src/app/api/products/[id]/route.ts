import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const hasUpdates = Object.keys(body).length > 0;
    if (!hasUpdates) {
      return NextResponse.json(
        { success: false, error: 'No valid fields provided for update' },
        { status: 400 }
      );
    }

    const prismaData: Record<string, unknown> = {};

    if (body.name !== undefined) prismaData.name = body.name;
    if (body.description !== undefined)
      prismaData.description = body.description;
    if (body.price !== undefined) {
      prismaData.price =
        typeof body.price === 'string' ? parseFloat(body.price) : body.price;
    }
    if (body.stock !== undefined) {
      prismaData.stock =
        typeof body.stock === 'string' ? parseInt(body.stock, 10) : body.stock;
    }
    if (body.images !== undefined) prismaData.images = body.images;
    if (body.categoryId !== undefined) {
      prismaData.category = { connect: { id: body.categoryId } };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: prismaData,
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);

    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Product ${id} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting product:', error);

    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      if (prismaError.code === 'P2003') {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot delete product because it has related records.',
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
