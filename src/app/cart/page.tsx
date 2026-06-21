'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store';
import { orderApi } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } =
    useCartStore();
  const { data: session } = useSession();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleCheckout = async () => {
    if (!session) {
      window.location.href = '/login';
      return;
    }
    try {
      setCheckingOut(true);
      await orderApi.create(
        items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
        }))
      );
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : '下单失败');
    } finally {
      setCheckingOut(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-3xl mb-4">🎉 下单成功！</h1>
        <p className="text-muted-foreground mb-8">
          您的订单已成功提交，请耐心等待发货。
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/orders">
            <Button>查看订单</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline">继续购物</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl mb-10">购物车</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 border border-border">
          <p className="text-muted-foreground mb-6">购物车是空的</p>
          <Link href="/shop">
            <Button variant="outline">去逛逛</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="border border-border divide-y divide-border mb-8">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-5 overflow-hidden"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="font-medium truncate hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="font-serif text-sm mt-1">
                      ¥{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border">
                      <button
                        className="px-3 py-1 text-sm hover:bg-secondary transition-colors"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="px-4 py-1 text-sm border-x border-border min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 py-1 text-sm hover:bg-secondary transition-colors"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <p className="font-serif w-20 text-right">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => removeItem(item.id)}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="border border-border p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground">合计</span>
              <span className="font-serif text-2xl">
                ¥{totalPrice().toFixed(2)}
              </span>
            </div>
            {orderError && (
              <p className="text-destructive text-sm mb-4">{orderError}</p>
            )}
            <div className="flex gap-4">
              <Button
                onClick={handleCheckout}
                disabled={checkingOut || items.length === 0}
                className="flex-1"
              >
                {checkingOut
                  ? '提交中...'
                  : session
                    ? '提交订单'
                    : '登录后下单'}
              </Button>
              <Button variant="outline" onClick={clearCart}>
                清空购物车
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
