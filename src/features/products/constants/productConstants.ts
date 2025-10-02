import { ProductLabel, DiscountType } from "../types/product";

// Product label options with Arabic translations
export const PRODUCT_LABELS: Record<
  ProductLabel,
  { ar: string; en: string; variant: string }
> = {
  none: {
    ar: "عادي",
    en: "Normal",
    variant: "default",
  },
  best_seller: {
    ar: "الأكثر مبيعاً",
    en: "Best Seller",
    variant: "success",
  },
  special_offer: {
    ar: "عرض خاص",
    en: "Special Offer",
    variant: "warning",
  },
};

// Discount type options
export const DISCOUNT_TYPES: Record<DiscountType, { ar: string; en: string }> =
  {
    none: {
      ar: "بدون خصم",
      en: "No Discount",
    },
    percent: {
      ar: "نسبة مئوية",
      en: "Percentage",
    },
    fixed: {
      ar: "مبلغ ثابت",
      en: "Fixed Amount",
    },
  };

// Product status options
export const PRODUCT_STATUS = {
  active: {
    ar: "نشط",
    en: "Active",
    variant: "default",
  },
  inactive: {
    ar: "غير نشط",
    en: "Inactive",
    variant: "secondary",
  },
} as const;

// File upload constraints
export const FILE_CONSTRAINTS = {
  images: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    maxFiles: 10,
  },
  documents: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 5,
  },
} as const;

// API endpoints
export const PRODUCT_ENDPOINTS = {
  list: "/supplier/products/my-products",
  create: "/supplier/products",
  get: (id: number) => `/supplier/products/${id}`,
  update: (id: number) => `/supplier/products/${id}/update`,
  delete: (id: number) => `/supplier/products/${id}`,
  uploadFiles: (id: number) => `/supplier/products/${id}/upload-files`,
  deleteMedia: (id: number, mediaId: number) =>
    `/supplier/products/${id}/media/${mediaId}`,
} as const;

// Grid responsive breakpoints
export const GRID_BREAKPOINTS = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
} as const;

// Animation delays for stagger effects
export const STAGGER_DELAYS = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
} as const;
