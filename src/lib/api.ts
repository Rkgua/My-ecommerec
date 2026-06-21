const API_BASE = '/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Prisma Decimal 序列化为 JSON 时是字符串，此函数统一转换为 number
function normalizeProduct(p: Record<string, unknown>): Product {
  return {
    ...p,
    price: Number(p.price),
    stock: Number(p.stock),
  } as unknown as Product;
}

function normalizeOrder(o: Record<string, unknown>): Order {
  return {
    ...o,
    total: Number(o.total),
    items: (o.items as Record<string, unknown>[]).map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  } as unknown as Order;
}

export const productApi = {
  async getAll(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
    const json: ApiResponse<Product[]> = await res.json();
    if (!json.success) throw new Error(json.error);
    return (json.data || []).map((p) =>
      normalizeProduct(p as unknown as Record<string, unknown>)
    );
  },

  async getById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      cache: 'no-store',
    });
    const json: ApiResponse<Product> = await res.json();
    if (!json.success) throw new Error(json.error);
    if (!json.data) throw new Error('Product not found');
    return normalizeProduct(json.data as unknown as Record<string, unknown>);
  },

  async create(data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json: ApiResponse<Product> = await res.json();
    if (!json.success) throw new Error(json.error);
    return normalizeProduct(json.data! as unknown as Record<string, unknown>);
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json: ApiResponse<Product> = await res.json();
    if (!json.success) throw new Error(json.error);
    return normalizeProduct(json.data! as unknown as Record<string, unknown>);
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    const json: ApiResponse<void> = await res.json();
    if (!json.success) throw new Error(json.error);
  },
};

export const categoryApi = {
  async getAll(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
    const json: ApiResponse<Category[]> = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data || [];
  },

  async getById(id: string): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      cache: 'no-store',
    });
    const json: ApiResponse<Category> = await res.json();
    if (!json.success) throw new Error(json.error);
    if (!json.data) throw new Error('Category not found');
    return json.data;
  },

  async create(data: { name: string }): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json: ApiResponse<Category> = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data!;
  },

  async update(id: string, data: { name: string }): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json: ApiResponse<Category> = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data!;
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
    });
    const json: ApiResponse<void> = await res.json();
    if (!json.success) throw new Error(json.error);
  },
};

export const orderApi = {
  async getAll(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, { cache: 'no-store' });
    const json: ApiResponse<Order[]> = await res.json();
    if (!json.success) throw new Error(json.error);
    return (json.data || []).map((o) =>
      normalizeOrder(o as unknown as Record<string, unknown>)
    );
  },

  async getById(id: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`, { cache: 'no-store' });
    const json: ApiResponse<Order> = await res.json();
    if (!json.success) throw new Error(json.error);
    if (!json.data) throw new Error('Order not found');
    return normalizeOrder(json.data as unknown as Record<string, unknown>);
  },

  async create(
    items: { productId: string; quantity: number; price: number }[]
  ): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const json: ApiResponse<Order> = await res.json();
    if (!json.success) throw new Error(json.error);
    return normalizeOrder(json.data! as unknown as Record<string, unknown>);
  },
};
