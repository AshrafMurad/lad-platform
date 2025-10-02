// API Response Models for Products
// These models match the exact API response structure for type safety

import {
  Product,
  ProductCategory,
  ProductMedia,
  ProductStats,
} from "../features/products/types";

// Base API Response Structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  response?: T;
  message?: string;
  meta?: PaginationMeta;
}

// Pagination Meta Information
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  path?: string;
  links?: PaginationLink[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Product API Response Models
export interface ProductListResponse {
  products: Product[];
  pagination: PaginationMeta;
}

export interface ProductResponse {
  product: Product;
}

export interface ProductStatsResponse {
  stats: ProductStats;
}

// Category API Response Models
export interface CategoryListResponse {
  categories: ProductCategory[];
}

export interface CategoryResponse {
  category: ProductCategory;
}

// Media Upload Response
export interface MediaUploadResponse {
  media: ProductMedia[];
  uploaded_count: number;
  failed_count: number;
  errors?: string[];
}

// Generic List Response with Pagination
export interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Error Response Model
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  error_code?: string;
}

// Success Response Model
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// File Upload Response
export interface FileUploadResponse {
  file_id: number;
  filename: string;
  original_name: string;
  size: number;
  mime_type: string;
  url: string;
}

// Bulk Operation Response
export interface BulkOperationResponse {
  success_count: number;
  failed_count: number;
  errors?: Array<{
    id: number;
    error: string;
  }>;
}
