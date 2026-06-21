import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
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
    const user = session.user as unknown as { role: string };
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '仅管理员可操作' },
        { status: 403 }
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
      { success: true, data: newProduct, message: '创建成功' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Error && 'code' in error) {
      const code = (error as { code: string }).code;
      if (code === 'P2003')
        return NextResponse.json(
          { success: false, error: '分类不存在' },
          { status: 400 }
        );
      if (code === 'P2002')
        return NextResponse.json(
          { success: false, error: '产品名已存在' },
          { status: 409 }
        );
    }
    return NextResponse.json(
      { success: false, error: '创建失败' },
      { status: 500 }
    );
  }
}
