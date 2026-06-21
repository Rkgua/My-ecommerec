import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
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

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json(
        { success: false, error: '分类名不能为空' },
        { status: 400 }
      );
    }
    const cat = await prisma.category.create({ data: { name } });
    return NextResponse.json({ success: true, data: cat }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { success: false, error: '分类名已存在' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: '创建失败' },
      { status: 500 }
    );
  }
}
