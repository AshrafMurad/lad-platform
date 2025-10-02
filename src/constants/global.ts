// Global constants shared across all features

// Common Status Types
export const COMMON_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

// File Upload Constraints (Global defaults)
export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_UPLOAD: 10,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
  PER_PAGE: 12,
  MAX_PER_PAGE: 100,
  MIN_PER_PAGE: 5,
  DEFAULT_PAGE: 1,
} as const;

// Currency Configuration
export const CURRENCY_CONFIG = {
  DEFAULT_CURRENCY: "SAR",
  SUPPORTED_CURRENCIES: ["EGP", "USD", "SAR", "AED"],
  DISPLAY_FORMATS: {
    EGP: { symbol: "ج.م", locale: "ar-EG" },
    USD: { symbol: "$", locale: "en-US" },
    SAR: { symbol: "ر.س", locale: "ar-SA" },
    AED: { symbol: "د.إ", locale: "ar-AE" },
  },
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY_DATE: "DD/MM/YYYY",
  DISPLAY_DATETIME: "DD/MM/YYYY HH:mm",
  API_DATE: "YYYY-MM-DD",
  API_DATETIME: "YYYY-MM-DD HH:mm:ss",
  LOCALE_DATE: {
    ar: "DD/MM/YYYY",
    en: "MM/DD/YYYY",
  },
} as const;

// Animation Durations (Global timing)
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  LOADING: 1000,
} as const;

// Breakpoints (Matches Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// Common Validation Rules
export const VALIDATION_RULES = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  PHONE_REGEX: /^(\+20|0)?1[0125]\d{8}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Error Messages (Global defaults)
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "فشل في الاتصال بالخادم",
  UNAUTHORIZED: "غير مخول للوصول",
  FORBIDDEN: "ممنوع الوصول",
  NOT_FOUND: "المورد غير موجود",
  SERVER_ERROR: "خطأ في الخادم",
  VALIDATION_ERROR: "خطأ في البيانات المدخلة",
  FILE_TOO_LARGE: "الملف كبير جداً",
  INVALID_FILE_TYPE: "نوع الملف غير مدعوم",
} as const;

// Success Messages (Global defaults)
export const SUCCESS_MESSAGES = {
  CREATED: "تم الإنشاء بنجاح",
  UPDATED: "تم التحديث بنجاح",
  DELETED: "تم الحذف بنجاح",
  UPLOADED: "تم الرفع بنجاح",
  SAVED: "تم الحفظ بنجاح",
} as const;
