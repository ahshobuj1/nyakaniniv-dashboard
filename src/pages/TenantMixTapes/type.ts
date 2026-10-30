export interface MixTapeTenant {
  id: string;
  userId?: string | null;
  stageName: string | null;
  subdomain: string | null;
  logoUrl?: string | null;
}

export interface MixTapeItem {
  id: string;
  tenantId: string | null;
  title: string | null;
  audioUrl: string | null;
  coverUrl: string | null;
  order: number | null;
  createdAt: string;
  updatedAt: string;
  tenant?: MixTapeTenant | null;
}

export interface MixTapesResponse {
  success: boolean;
  message: string;
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
  data: MixTapeItem[];
}

