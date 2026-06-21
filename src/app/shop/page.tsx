'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  productApi,
  categoryApi,
  type Product,
  type Category,
} from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    Promise.all([productApi.getAll(), categoryApi.getAll()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      filterCategory === 'all' || p.categoryId === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="border-b border-border pb-12 mb-12">
        <h1 className="font-serif text-5xl leading-tight mb-4">精选好物</h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          每一件商品都经过精心挑选，追求品质与设计的平衡。
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-10">
        <Input
          placeholder="搜索商品..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="max-w-[160px]">
            <SelectValue placeholder="全部分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">暂无匹配的商品</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setFilterCategory('all');
            }}
          >
            清除筛选
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
          {filtered.map((product) => (
            <div key={product.id} className="bg-card group">
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square bg-muted border-b border-border overflow-hidden flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover img-bw"
                    />
                  ) : (
                    <span className="font-serif text-muted-foreground text-lg">
                      {product.name[0]}
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-5">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground mb-1">
                  {product.category?.name}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg">
                    ¥{Number(product.price).toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: Number(product.price),
                        image: product.images?.[0] || '',
                      })
                    }
                  >
                    加入购物车
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
