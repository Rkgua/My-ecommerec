'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { productApi, type Product } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (id) {
      productApi
        .getById(id as string)
        .then(setProduct)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-2xl mb-4">商品不存在</h1>
        <Link href="/shop">
          <Button variant="outline">返回商店</Button>
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        返回商店
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square bg-muted border border-border flex items-center justify-center">
          <span className="font-serif text-4xl text-muted-foreground">
            {product.name[0]}
          </span>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {product.category?.name}
          </p>
          <h1 className="font-serif text-3xl mb-4">{product.name}</h1>
          <p className="font-serif text-2xl mb-8">
            ¥{Number(product.price).toFixed(2)}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            库存：{product.stock} 件
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={handleAdd}
              className={added ? 'bg-green-700 hover:bg-green-700' : ''}
            >
              {added ? '✅ 已加入购物车' : '加入购物车'}
            </Button>
            <Link href="/cart">
              <Button variant="outline" size="lg">
                查看购物车
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
