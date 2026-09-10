import axiosClient from './axiosClient';

export interface CreateCardDto {
  title: string;
  templateId?: string;
  groomName?: string;
  brideName?: string;
}

export interface QueryCardDto {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CanvasBlockPayload {
  id?: string;
  blockType: string;
  posX?: number;
  posY?: number;
  width?: number;
  height?: number;
  rotation?: number;
  zIndex?: number;
  content?: object;
  style?: object;
  isLocked?: boolean;
  isVisible?: boolean;
  sourceElementId?: string;
  sourceTemplateBlockId?: string;
}

export interface SaveCanvasPayload {
  blocks: CanvasBlockPayload[];
  background?: object;
  settings?: object;
}

export const cardsApi = {
  createCard: async (data: CreateCardDto) => {
    const response = await axiosClient.post('/cards', data);
    return response.data;
  },

  getUserCards: async (query?: QueryCardDto) => {
    const response = await axiosClient.get('/cards', { params: query });
    return response.data;
  },

  deleteCard: async (id: string) => {
    const response = await axiosClient.delete(`/cards/${id}`);
    return response.data;
  },

  saveCanvas: async (cardId: string, payload: SaveCanvasPayload) => {
    const response = await axiosClient.post(`/cards/${cardId}/save`, payload);
    return response.data;
  },

  uploadCardThumbnail: async (cardId: string, blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'thumbnail.webp');
    const response = await axiosClient.post(`/cards/${cardId}/thumbnail`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getCard: async (cardId: string) => {
    const response = await axiosClient.get(`/cards/${cardId}`);
    return response.data;
  },

  getCardStats: async (cardId: string) => {
    const response = await axiosClient.get(`/cards/${cardId}/stats`);
    return response.data;
  },

  updateCard: async (cardId: string, data: { title?: string; slug?: string; isPublic?: boolean; status?: string }) => {
    const response = await axiosClient.patch(`/cards/${cardId}`, data);
    return response.data;
  },

  checkSlug: async (slug: string, excludeCardId?: string) => {
    const response = await axiosClient.get(`/cards/check-slug`, {
      params: { slug, excludeCardId },
    });
    return response.data;
  },

  getAllWishes: async () => {
    const response = await axiosClient.get('/wishes');
    return response.data;
  },

  getAllRsvps: async () => {
    const response = await axiosClient.get('/rsvps');
    return response.data;
  },

  approveWish: async (wishId: string, isApproved: boolean) => {
    const response = await axiosClient.patch(`/wishes/${wishId}/approve`, { isApproved });
    return response.data;
  },

  deleteWish: async (wishId: string) => {
    const response = await axiosClient.delete(`/wishes/${wishId}`);
    return response.data;
  },

  submitRsvp: async (cardId: string, data: { guestName: string; phone?: string; attending: 'yes' | 'no' | 'maybe'; numAttendees?: number; note?: string; side?: string; entries?: any[] }) => {
    const response = await axiosClient.post(`/rsvps/public/${cardId}`, data);
    return response.data;
  },

  submitWish: async (cardId: string, data: { displayName: string; message: string; avatarUrl?: string; side?: string }) => {
    const response = await axiosClient.post(`/wishes/public/${cardId}`, data);
    return response.data;
  },

  getPublicCard: async (slug: string, password?: string) => {
    const response = await axiosClient.get(`/cards/public/${slug}`, {
      params: password ? { password } : undefined,
    });
    return response.data;
  },

  duplicateCard: async (cardId: string) => {
    const response = await axiosClient.post(`/cards/${cardId}/duplicate`);
    return response.data;
  },
};
