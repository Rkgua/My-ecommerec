import { NextResponse } from 'next/server';
import { PrismaClient, Product, Category } from '@prisma/client';

// 🔒 全局单例模式防止开发环境热重载导致连接过多
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 定义请求体的类型接口
interface ProductCreateInput {
  name: string;
  description?: string;
  price: number | string; // 允许字符串以便前端直接传，后端转换
  stock: number | string;
  images?: string[];
  categoryId: string;
}

// --- GET: 获取产品列表 ---
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

// --- POST: 创建新产品 ---
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 类型断言：告诉 TS 这个 body 符合我们的接口结构
    const {
      name,
      description,
      price,
      stock,
      images,
      categoryId,
    }: ProductCreateInput = body;

    // 基础验证
    if (!name || price === undefined || stock === undefined || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, price, stock, or categoryId',
        },
        { status: 400 }
      );
    }

    // 构建分类关联对象 (严格类型)
    const categoryConnect = {
      connect: { id: categoryId },
    };

    // 执行创建
    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: typeof price === 'string' ? parseFloat(price) : price,
        stock: typeof stock === 'string' ? parseInt(stock, 10) : stock,
        images: images || [],
        category: categoryConnect,
      },
      include: {
        category: true,
      },
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

    // 类型守卫：检查是否是 Prisma 错误
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
