// src/services/api.ts
//
// LỚP SERVICE LAYER DÙNG CHUNG CHO TOÀN APP
// -------------------------------------------------------------
// Hiện tại CHƯA có backend thật nên mọi hàm bên dưới đọc/ghi vào
// localStorage để giả lập một API thật (có độ trễ network giả lập).
//
// Khi có backend thật, bạn chỉ cần thay nội dung BÊN TRONG mỗi hàm
// bằng `fetch('/api/...')` hoặc `axios.get(...)`, KHÔNG cần đổi tên
// hàm hay cách các component gọi (vì cùng trả về Promise<T>).
//
// Ví dụ chuyển sang thật:
//   async list(): Promise<WeddingCard[]> {
//     const res = await fetch('/api/cards');
//     if (!res.ok) throw new ApiError('Không tải được danh sách thiệp');
//     return res.json();
//   }
// -------------------------------------------------------------

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Độ trễ giả lập network để UI có cơ hội hiển thị loading state thật
const delay = (ms = 0) => new Promise((res) => setTimeout(res, ms));

const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const slugify = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ---------------------------------------------------------------
// Storage helpers (mock "database" sống trong localStorage)
// ---------------------------------------------------------------
const DB_KEYS = {
  user: 'zenlove_user',
  cards: 'zenlove_cards',
  wishes: 'zenlove_wishes',
  rsvps: 'zenlove_rsvps',
  gifts: 'zenlove_gifts',
} as const;

function readDb<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeDb<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeed() {
  if (!localStorage.getItem(DB_KEYS.user)) {
    writeDb<UserProfile>(DB_KEYS.user, {
      id: 'user_demo',
      fullName: 'Nguyen Van A',
      email: 'nguyenA@example.com',
      phone: '',
      dob: '',
      bio: '',
      avatarLetter: 'N',
      plan: 'free',
      viewsUsed: 0,
      viewsLimit: 300,
    });
  }
  if (!localStorage.getItem(DB_KEYS.cards)) writeDb<WeddingCard[]>(DB_KEYS.cards, []);
  if (!localStorage.getItem(DB_KEYS.wishes)) writeDb<Wish[]>(DB_KEYS.wishes, []);
  if (!localStorage.getItem(DB_KEYS.rsvps)) writeDb<RsvpEntry[]>(DB_KEYS.rsvps, []);
  if (!localStorage.getItem(DB_KEYS.gifts)) writeDb<GiftEntry[]>(DB_KEYS.gifts, []);
}

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  bio: string;
  avatarLetter: string;
  plan: 'free' | 'pro' | 'premium';
  viewsUsed: number;
  viewsLimit: number;
}

export interface WeddingCard {
  id: string;
  slug: string | null;
  title: string;
  bride: string;
  groom: string;
  weddingDate: string; // YYYY-MM-DD
  weddingTime: string; // HH:mm
  venue: string;
  coverImage: string;
  status: 'draft' | 'published';
  views: number;
  canvasData: any; // toJSON() từ fabric, lưu nguyên trạng thái editor
  createdAt: string;
  updatedAt: string;
}

export interface Wish {
  id: string;
  cardId: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface RsvpEntry {
  id: string;
  cardId: string;
  name: string;
  phone: string;
  attending: 'yes' | 'no';
  guestCount: number;
  createdAt: string;
}

export interface GiftEntry {
  id: string;
  cardId: string;
  senderName: string;
  giftName: string;
  amount: number;
  createdAt: string;
}

// ---------------------------------------------------------------
// AUTH / ACCOUNT
// ---------------------------------------------------------------
export const authApi = {
  async getCurrentUser(): Promise<UserProfile> {
    ensureSeed();
    await delay();
    return readDb<UserProfile>(DB_KEYS.user, {} as UserProfile);
  },

  async updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
    ensureSeed();
    await delay();
    const current = readDb<UserProfile>(DB_KEYS.user, {} as UserProfile);
    const updated = { ...current, ...patch };
    writeDb(DB_KEYS.user, updated);
    return updated;
  },
};

// ---------------------------------------------------------------
// CARDS (Thiệp của tôi)
// ---------------------------------------------------------------
export const cardsApi = {
  async list(): Promise<WeddingCard[]> {
    ensureSeed();
    await delay();
    return readDb<WeddingCard[]>(DB_KEYS.cards, []);
  },

  async get(id: string): Promise<WeddingCard> {
    ensureSeed();
    await delay(250);
    const card = readDb<WeddingCard[]>(DB_KEYS.cards, []).find((c) => c.id === id);
    if (!card) throw new ApiError('Không tìm thấy thiệp', 404);
    return card;
  },

  async getBySlug(slug: string): Promise<WeddingCard> {
    ensureSeed();
    await delay(350);
    const card = readDb<WeddingCard[]>(DB_KEYS.cards, []).find((c) => c.slug === slug);
    if (!card) throw new ApiError('Thiệp không tồn tại hoặc đã bị gỡ', 404);
    // tăng lượt xem mỗi khi có người mở trang công khai
    const all = readDb<WeddingCard[]>(DB_KEYS.cards, []);
    const idx = all.findIndex((c) => c.id === card.id);
    if (idx >= 0) {
      all[idx].views += 1;
      writeDb(DB_KEYS.cards, all);
    }
    return { ...card, views: card.views + 1 };
  },

  async create(payload: Partial<WeddingCard>): Promise<WeddingCard> {
    ensureSeed();
    await delay();
    const now = new Date().toISOString();
    const card: WeddingCard = {
      id: uid('card'),
      slug: null,
      title: payload.title || 'Thiệp chưa đặt tên',
      bride: payload.bride || 'Cô dâu',
      groom: payload.groom || 'Chú rể',
      weddingDate: payload.weddingDate || '',
      weddingTime: payload.weddingTime || '',
      venue: payload.venue || '',
      coverImage: payload.coverImage || '',
      status: 'draft',
      views: 0,
      canvasData: payload.canvasData || null,
      createdAt: now,
      updatedAt: now,
    };
    const all = readDb<WeddingCard[]>(DB_KEYS.cards, []);
    all.push(card);
    writeDb(DB_KEYS.cards, all);
    return card;
  },

  async update(id: string, patch: Partial<WeddingCard>): Promise<WeddingCard> {
    ensureSeed();
    await delay();
    const all = readDb<WeddingCard[]>(DB_KEYS.cards, []);
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) throw new ApiError('Không tìm thấy thiệp để cập nhật', 404);
    all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    writeDb(DB_KEYS.cards, all);
    return all[idx];
  },

  /** Lưu nháp (không đổi status, không sinh slug) */
  async saveDraft(id: string, canvasData: any): Promise<WeddingCard> {
    return this.update(id, { canvasData });
  },

  /** Xuất bản: sinh slug (nếu chưa có) + đổi status = published */
  async publish(id: string, canvasData?: any): Promise<WeddingCard> {
    ensureSeed();
    await delay(600);
    const all = readDb<WeddingCard[]>(DB_KEYS.cards, []);
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) throw new ApiError('Không tìm thấy thiệp để xuất bản', 404);

    let slug = all[idx].slug;
    if (!slug) {
      const base = slugify(`${all[idx].bride}-${all[idx].groom}`) || 'thiep-cuoi';
      let candidate = base;
      let n = 1;
      while (all.some((c) => c.slug === candidate)) {
        candidate = `${base}-${n}`;
        n += 1;
      }
      slug = candidate;
    }

    all[idx] = {
      ...all[idx],
      slug,
      status: 'published',
      canvasData: canvasData ?? all[idx].canvasData,
      updatedAt: new Date().toISOString(),
    };
    writeDb(DB_KEYS.cards, all);
    return all[idx];
  },

  async remove(id: string): Promise<void> {
    ensureSeed();
    await delay();
    const all = readDb<WeddingCard[]>(DB_KEYS.cards, []);
    writeDb(DB_KEYS.cards, all.filter((c) => c.id !== id));
  },
};

// ---------------------------------------------------------------
// WISHES (Lời chúc) — khách gửi từ trang công khai, chủ thiệp xem ở dashboard
// ---------------------------------------------------------------
export const wishesApi = {
  async listForUser(): Promise<Wish[]> {
    ensureSeed();
    await delay();
    const cardIds = new Set(readDb<WeddingCard[]>(DB_KEYS.cards, []).map((c) => c.id));
    return readDb<Wish[]>(DB_KEYS.wishes, [])
      .filter((w) => cardIds.has(w.cardId))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  async listForCard(cardId: string): Promise<Wish[]> {
    ensureSeed();
    await delay(300);
    return readDb<Wish[]>(DB_KEYS.wishes, [])
      .filter((w) => w.cardId === cardId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  async create(cardId: string, data: { name: string; message: string }): Promise<Wish> {
    ensureSeed();
    await delay(400);
    const wish: Wish = {
      id: uid('wish'),
      cardId,
      name: data.name.trim(),
      message: data.message.trim(),
      createdAt: new Date().toISOString(),
    };
    const all = readDb<Wish[]>(DB_KEYS.wishes, []);
    all.unshift(wish);
    writeDb(DB_KEYS.wishes, all);
    return wish;
  },

  async remove(id: string): Promise<void> {
    await delay(200);
    const all = readDb<Wish[]>(DB_KEYS.wishes, []);
    writeDb(DB_KEYS.wishes, all.filter((w) => w.id !== id));
  },
};

// ---------------------------------------------------------------
// RSVP
// ---------------------------------------------------------------
export const rsvpApi = {
  async listForUser(): Promise<RsvpEntry[]> {
    ensureSeed();
    await delay();
    const cardIds = new Set(readDb<WeddingCard[]>(DB_KEYS.cards, []).map((c) => c.id));
    return readDb<RsvpEntry[]>(DB_KEYS.rsvps, [])
      .filter((r) => cardIds.has(r.cardId))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  async create(
    cardId: string,
    data: { name: string; phone: string; attending: 'yes' | 'no'; guestCount: number }
  ): Promise<RsvpEntry> {
    ensureSeed();
    await delay(400);
    const entry: RsvpEntry = {
      id: uid('rsvp'),
      cardId,
      name: data.name.trim(),
      phone: data.phone.trim(),
      attending: data.attending,
      guestCount: data.guestCount || 1,
      createdAt: new Date().toISOString(),
    };
    const all = readDb<RsvpEntry[]>(DB_KEYS.rsvps, []);
    all.unshift(entry);
    writeDb(DB_KEYS.rsvps, all);
    return entry;
  },
};

// ---------------------------------------------------------------
// GIFTS (Quà tặng) — để sẵn cho tích hợp cổng thanh toán/ghi nhận quà sau này
// ---------------------------------------------------------------
export const giftsApi = {
  async listForUser(): Promise<GiftEntry[]> {
    ensureSeed();
    await delay();
    const cardIds = new Set(readDb<WeddingCard[]>(DB_KEYS.cards, []).map((c) => c.id));
    return readDb<GiftEntry[]>(DB_KEYS.gifts, [])
      .filter((g) => cardIds.has(g.cardId))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
};

// ---------------------------------------------------------------
// OVERVIEW (Tổng quan dashboard)
// ---------------------------------------------------------------
export const overviewApi = {
  async getStats() {
    ensureSeed();
    await delay();
    const cards = readDb<WeddingCard[]>(DB_KEYS.cards, []);
    const user = readDb<UserProfile>(DB_KEYS.user, {} as UserProfile);
    const totalViews = cards.reduce((sum, c) => sum + c.views, 0);
    return {
      activeCards: cards.filter((c) => c.status === 'published').length,
      totalCards: cards.length,
      totalViews,
      viewsLimit: user.viewsLimit,
      plan: user.plan,
    };
  },
};