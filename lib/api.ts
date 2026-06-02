const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan');
  return data;
}

async function authFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!token) throw new Error('Belum login');
  return fetchApi<T>(endpoint, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options?.headers },
  });
}

export const api = {
  async updateOrderStatus(token: string, orderId: number, status: OrderStatus): Promise<Record<string, unknown>> {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengubah status');
    return data;
  },

  async getMyOrders(token: string): Promise<OrderListResponse> {
    const res = await fetch(`${API_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat pesanan');
    return data;
  },

  async getOrders(token: string): Promise<OrderListResponse> {
    const res = await fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat pesanan');
    return data;
  },

  async getUserProfile(token: string) {
    const res = await fetch(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  async updateProfile(token: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Gagal memperbarui profil');
    return result;
  },

  async getProducts(): Promise<ProductListResponse> {
    const res = await fetch(`${API_URL}/products`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat produk');
    return data;
  },

  async getProductById(id: number): Promise<ProductItemResponse> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat produk');
    return data;
  },

  async getCart(): Promise<CartResponse> {
    return authFetch('/cart');
  },

  async addToCart(productId: number, quantity: number = 1): Promise<CartAddResponse> {
    return authFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  async updateCartItem(cartId: number, quantity: number): Promise<CartAddResponse> {
    return authFetch(`/cart/${cartId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  async removeCartItem(cartId: number): Promise<Record<string, unknown>> {
    return authFetch(`/cart/${cartId}`, { method: 'DELETE' });
  },

  async checkout(items?: { productId: number; quantity: number; price: number }[]): Promise<CheckoutResponse> {
    return authFetch('/orders/checkout', {
      method: 'POST',
      body: items ? JSON.stringify({ items }) : undefined,
    });
  },

  async downloadReceipt(orderId: number): Promise<Blob> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) throw new Error('Belum login');

    const res = await fetch(`${API_URL}/orders/${orderId}/receipt`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error('Gagal mengunduh struk');
    }

    return res.blob();
  },

  async uploadPaymentProof(orderId: number, file: File): Promise<PaymentProofResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) throw new Error('Belum login');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/payment/upload-proof/${orderId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengunggah bukti pembayaran');
    return data;
  },

  async getPaymentProofs(orderId: number): Promise<PaymentProofData[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) throw new Error('Belum login');

    const res = await fetch(`${API_URL}/payment/proof/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat bukti pembayaran');
    return Array.isArray(data) ? data : data.data ?? [];
  },

  async getUsers(token: string) {
    const res = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat data pengguna');
    return data;
  },

  async getContacts(token: string) {
    const res = await fetch(`${API_URL}/contacts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat kontak');
    return data;
  },

  async updateContactStatus(token: string, id: number, status: string) {
    const res = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengubah status');
    return data;
  },

  async getReviews(productId: number): Promise<Review[]> {
    const res = await fetch(`${API_URL}/ratings/product/${productId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat ulasan');
    return Array.isArray(data) ? data : data.data ?? [];
  },

  async createRating(productId: number, score: number, comment: string): Promise<Review> {
    return authFetch('/ratings', {
      method: 'POST',
      body: JSON.stringify({ productId, score, comment }),
    });
  },
};

export interface Review {
  id: number;
  productId: number;
  userId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PaymentProofData {
  id: number;
  orderId: number;
  fileUrl: string;
  status: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentProofResponse {
  success: boolean;
  message: string;
  data: PaymentProofData;
}

export type ProductListResponse = ProductItem[] | {
  statusCode: number;
  message: string;
  success: boolean;
  data: ProductItem[];
};

export type ProductItemResponse = ProductItem | {
  statusCode: number;
  message: string;
  success: boolean;
  data: ProductItem;
};

export interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryId: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  category?: { id: number; name: string };
}

export type CartResponse =
  | { items: CartItemData[]; subtotal: number }
  | { statusCode: number; message: string; success: boolean; data: { items: CartItemData[]; subtotal: number } };

export type CartAddResponse = CartItemData;

export interface CartItemData {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartProductData;
}

export interface CartProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryId: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  category?: { name: string } | null;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED';

export interface AdminOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  product: { name: string };
}

export interface AdminPayment {
  id: number;
  orderId: number;
  userId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: number;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  user: { name: string; email: string };
  orderItems: AdminOrderItem[];
  payment: AdminPayment;
}

export interface CheckoutResponse {
  message: string;
  orderId: number;
  totalAmount: number;
  status: string;
  instruction: string;
}

export type OrderListResponse =
  | AdminOrder[]
  | { statusCode: number; message: string; success: boolean; data: AdminOrder[] };
