'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { orderApi, type Order } from '@/lib/api';
import { Button } from '@/components/ui/button';

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: '待付款', color: 'text-yellow-600' },
  PAID: { label: '已付款', color: 'text-green-600' },
  SHIPPED: { label: '已发货', color: 'text-blue-600' },
  DELIVERED: { label: '已送达', color: 'text-green-700' },
  CANCELLED: { label: '已取消', color: 'text-red-600' },
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      orderApi
        .getAll()
        .then(setOrders)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-2xl mb-4">请先登录</h1>
        <Link href="/login">
          <Button variant="outline">去登录</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl mb-10">我的订单</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-border">
          <p className="text-muted-foreground mb-6">暂无订单</p>
          <Link href="/shop">
            <Button variant="outline">去购物</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-border">
              {/* Order Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-secondary/30 border-b border-border">
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 8)}
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${statusLabels[order.status]?.color || ''}`}
                >
                  {statusLabels[order.status]?.label || order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 divide-y divide-border">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-sm font-medium hover:text-primary transition-colors truncate block"
                      >
                        {item.product?.name || '商品已删除'}
                      </Link>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>×{item.quantity}</span>
                      <span className="font-serif w-20 text-right text-foreground">
                        ¥{Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex justify-end items-center gap-4 px-6 py-3 bg-secondary/20 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} 件商品
                </span>
                <span className="font-serif text-lg">
                  合计：¥{Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
