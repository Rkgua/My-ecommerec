import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { ProductDetailClient } from './ProductDetailClient';

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { id: true },
    take: 20,
  });
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: '商品不存在' };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-2xl mb-4">商品不存在</h1>
      </div>
    );
  }

  const normalized = {
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
  } as unknown as {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    category?: { name: string } | null;
  };

  return <ProductDetailClient product={normalized} />;
}
