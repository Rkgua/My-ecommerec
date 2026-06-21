import { Product } from '@/lib/api';
import { ShopClient } from './ShopClient';
import prisma from '@/lib/prisma';
import type { Category as PrismaCategory } from '@prisma/client';

export const revalidate = 60;

function normalizeProduct(p: Record<string, unknown>): Product {
  return {
    ...p,
    price: Number(p.price),
    stock: Number(p.stock),
  } as unknown as Product;
}

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
      take: 12,
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  const total = await prisma.product.count();

  return (
    <ShopClient
      initialProducts={products.map((p) =>
        normalizeProduct(p as unknown as Record<string, unknown>)
      )}
      initialPagination={{
        page: 1,
        pageSize: 12,
        total,
        totalPages: Math.ceil(total / 12),
      }}
      categories={categories.map(
        (c: PrismaCategory & { _count?: { products: number } }) => ({
          id: c.id,
          name: c.name,
          _count: c._count,
        })
      )}
    />
  );
}
