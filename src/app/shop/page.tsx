'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  productApi,
  categoryApi,
  type Product,
  type Category,
  type Pagination,
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
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const fetchProducts = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          page: p,
          pageSize: 12,
        };
        if (search) params.search = search;
        if (filterCategory !== 'all') params.categoryId = filterCategory;
        const result = await productApi.getAll(params);
        setProducts(result.products);
        setPagination(result.pagination);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    },
    [search, filterCategory]
  );

  useEffect(() => {
    categoryApi.getAll().then(setCategories);
  }, []);
  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [search, filterCategory, fetchProducts]);

  const goToPage = (newPage: number) => {
    setPage(newPage);
    fetchProducts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="border-b border-border pb-12 mb-12">
        <h1 className="font-serif text-5xl leading-tight mb-4">精选好物</h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          每一件商品都经过精心挑选，追求品质与设计的平衡。
        </p>
      </div>

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

      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : products.length === 0 ? (
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
            {products.map((product) => (
              <div key={product.id} className="bg-card group">
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-square bg-muted border-b border-border overflow-hidden flex items-center justify-center relative">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover img-bw"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                      ¥{product.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
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

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
              >
                上一页
              </Button>
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => goToPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => goToPage(page + 1)}
              >
                下一页
              </Button>
              <span className="text-sm text-muted-foreground ml-4">
                共 {pagination.total} 件
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
