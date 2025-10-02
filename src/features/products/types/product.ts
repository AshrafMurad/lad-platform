// Product types based on API documentation

export type ProductLabel = "none" | "best_seller" | "special_offer";
export type DiscountType = "none" | "percent" | "fixed";

export interface ProductCategory {
  id: number;
  name?: string; // API field - single name
  name_ar?: string; // Legacy field
  name_en?: string; // Legacy field
  parent_id?: number;
}

export interface ProductMedia {
  id: number;
  url?: string; // Legacy field
  original_url?: string; // API field
  type?: "image" | "document";
  filename?: string;
  file_name?: string; // API field
  name?: string; // API field
  size?: number;
  size_formatted?: string; // API field
  mime_type?: string;
  custom_properties?: any[]; // API field
  order_column?: string; // API field
  created_at: string;
  updated_at?: string; // API field
}

export interface Product {
  id: number | string; // Allow string for optimistic updates
  name: string; // Single name field from API
  description?: string; // Single description field from API

  // Legacy fields for backward compatibility (may be used in forms)
  name_ar?: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;

  main_category_id?: number;
  sub_category_id?: number;
  micro_category_id?: number;
  price: number | string; // API returns string
  discount_type: DiscountType;
  discount_value?: number | string; // API returns string
  price_after_discount?: number | string; // API calculated field
  final_price?: number; // Calculated price after discount
  label: ProductLabel;
  is_active: boolean;
  display_order?: number;

  // Relationships (API structure)
  main_category?: ProductCategory;
  sub_category?: ProductCategory;
  micro_category?: ProductCategory;
  product_images?: ProductMedia[];
  product_documents?: ProductMedia[];

  // Legacy relationships for backward compatibility
  category?: ProductCategory;
  images?: ProductMedia[];
  documents?: ProductMedia[];

  // Additional API fields
  pricing_rules?: any[];
  project_usages?: any[];

  // UI state (for optimistic updates)
  is_optimistic?: boolean;
  is_loading?: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// Product creation/update data
export interface ProductFormData {
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  main_category_id: number;
  sub_category_id?: number;
  micro_category_id?: number;
  price: number;
  discount_type: DiscountType;
  discount_value?: number;
  label: ProductLabel;
  is_active: boolean;
  display_order?: number;

  // File uploads
  product_images?: File[];
  product_documents?: File[];

  // For updates: files to delete
  files_to_delete?: number[];
}

// API filters for product listing
export interface ProductFilters {
  category_id?: number;
  sub_category_id?: number;
  micro_category_id?: number;
  label?: ProductLabel;
  is_active?: boolean;
  search?: string;
  per_page?: number;
  page?: number;
}

// Product statistics
export interface ProductStats {
  total_products: number;
  active_products: number;
  inactive_products: number;
  by_label: Record<ProductLabel, number>;
  by_category: Record<number, number>;
}

// Optimistic update operation
export interface OptimisticOperation {
  id: string;
  type: "create" | "update" | "delete";
  productId: number | string;
  originalData?: Product;
  newData?: Partial<Product>;
  timestamp: number;
}
