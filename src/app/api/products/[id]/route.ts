import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 🔒 全局单例模式
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 定义更新请求体的类型接口 (所有字段可选)
interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number | string;
  stock?: number | string;
  images?: string[];
  categoryId?: string;
}

// 定义动态路由参数的类型
interface RouteParams {
  params: Promise<{ id: string }>;
}

// --- GET: 获取单个产品详情 ---
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

// --- PUT: 更新产品信息 ---
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 类型断言
    const updateData: ProductUpdateInput = body;

    // 验证：至少需要一个字段
    const hasUpdates = Object.keys(updateData).length > 0;
    if (!hasUpdates) {
      return NextResponse.json(
        { success: false, error: 'No valid fields provided for update' },
        { status: 400 }
      );
    }

    // 构建安全的 Prisma data 对象
    // 我们使用一个中间对象来收集数据，避免直接任何类型
    const prismaData: Record<string, unknown> = {};

    if (updateData.name !== undefined) prismaData.name = updateData.name;
    if (updateData.description !== undefined)
      prismaData.description = updateData.description;

    if (updateData.price !== undefined) {
      prismaData.price =
        typeof updateData.price === 'string'
          ? parseFloat(updateData.price)
          : updateData.price;
    }

    if (updateData.stock !== undefined) {
      prismaData.stock =
        typeof updateData.stock === 'string'
          ? parseInt(updateData.stock, 10)
          : updateData.stock;
    }

    if (updateData.images !== undefined) {
      prismaData.images = updateData.images;
    }

    // 特殊处理分类关联
    if (updateData.categoryId !== undefined) {
      prismaData.category = {
        connect: { id: updateData.categoryId },
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: prismaData, // Prisma 接受 Record<string, unknown> 作为 data
      include: {
        category: true,
      },
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

// --- DELETE: 删除产品 ---
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

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
