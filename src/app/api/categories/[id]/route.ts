import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json(
        { success: false, error: '分类名不能为空' },
        { status: 400 }
      );
    }
    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating category:', error);
    if (error instanceof Error && 'code' in error) {
      const code = (error as { code: string }).code;
      if (code === 'P2025')
        return NextResponse.json(
          { success: false, error: '不存在' },
          { status: 404 }
        );
      if (code === 'P2002')
        return NextResponse.json(
          { success: false, error: '分类名已存在' },
          { status: 409 }
        );
    }
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: '已删除' });
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error instanceof Error && 'code' in error) {
      const code = (error as { code: string }).code;
      if (code === 'P2025')
        return NextResponse.json(
          { success: false, error: '不存在' },
          { status: 404 }
        );
      if (code === 'P2003')
        return NextResponse.json(
          { success: false, error: '有关联产品无法删除' },
          { status: 400 }
        );
    }
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    );
  }
}
