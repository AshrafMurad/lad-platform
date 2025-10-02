import { request, ApiResponse } from "@/lib/apiClient";
import {
  IMAGE_FILE_CONFIG,
  DOCUMENT_FILE_CONFIG,
  FormDataOptions,
} from "@/lib/formDataUtils";
import {
  Product,
  ProductFormData,
  ProductFilters,
  ProductMedia,
} from "../types";
import { PRODUCT_ENDPOINTS } from "../constants";

/**
 * Product API Service
 * Handles all product-related API operations with file upload support
 */
class ProductApiService {
  /**
   * Get supplier's products with optional filters
   */
  async getMyProducts(
    filters?: ProductFilters
  ): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.search) params.append("search", filters.search);
      if (filters.category_id)
        params.append("category_id", filters.category_id.toString());
      if (filters.sub_category_id)
        params.append("sub_category_id", filters.sub_category_id.toString());
      if (filters.micro_category_id)
        params.append(
          "micro_category_id",
          filters.micro_category_id.toString()
        );
      if (filters.label && filters.label !== "none")
        params.append("label", filters.label);
      if (filters.is_active !== undefined)
        params.append("is_active", filters.is_active.toString());
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.per_page)
        params.append("per_page", filters.per_page.toString());
    }

    const queryString = params.toString();
    const url = queryString
      ? `${PRODUCT_ENDPOINTS.list}?${queryString}`
      : PRODUCT_ENDPOINTS.list;

    return request<Product[]>("get", url);
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return request<Product>("get", PRODUCT_ENDPOINTS.get(id));
  }

  /**
   * Create a new product (without files - files handled separately)
   */
  async createProduct(data: ProductFormData): Promise<ApiResponse<Product>> {
    // Remove file fields since they're handled separately
    const {
      product_images,
      product_documents,
      files_to_delete,
      ...productData
    } = data;

    return request<Product>("post", PRODUCT_ENDPOINTS.create, productData);
  }

  /**
   * Update an existing product (without files - files handled separately)
   */
  async updateProduct(
    id: number,
    data: ProductFormData
  ): Promise<ApiResponse<Product>> {
    // Remove file fields since they're handled separately
    const {
      product_images,
      product_documents,
      files_to_delete,
      ...productData
    } = data;

    return request<Product>("post", PRODUCT_ENDPOINTS.update(id), productData);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return request<void>("delete", PRODUCT_ENDPOINTS.delete(id));
  }

  /**
   * Upload additional files to an existing product
   */
  async uploadProductFiles(
    id: number,
    files: {
      product_images?: File[];
      product_documents?: File[];
    }
  ): Promise<ApiResponse<ProductMedia[]>> {
    const options: FormDataOptions = {
      fileFields: {
        "product_images[]": IMAGE_FILE_CONFIG,
        "product_documents[]": DOCUMENT_FILE_CONFIG,
      },
      validateFiles: true,
      excludeEmptyFiles: true,
    };

    return request<ProductMedia[]>(
      "post",
      PRODUCT_ENDPOINTS.uploadFiles(id),
      files,
      { formDataOptions: options }
    );
  }

  /**
   * Delete a specific media file from a product
   */
  async deleteProductMedia(
    productId: number,
    mediaId: number
  ): Promise<ApiResponse<void>> {
    return request<void>(
      "delete",
      PRODUCT_ENDPOINTS.deleteMedia(productId, mediaId)
    );
  }

  /**
   * Batch operations for multiple products
   */
  async batchUpdateProducts(
    updates: Array<{ id: number; data: Partial<ProductFormData> }>
  ): Promise<ApiResponse<Product[]>> {
    return request<Product[]>("patch", `${PRODUCT_ENDPOINTS.list}/batch`, {
      updates,
    });
  }

  /**
   * Toggle product active status
   */
  async toggleProductStatus(
    id: number,
    isActive: boolean
  ): Promise<ApiResponse<Product>> {
    return request<Product>("patch", PRODUCT_ENDPOINTS.update(id), {
      is_active: isActive,
    });
  }

  /**
   * Duplicate an existing product
   */
  async duplicateProduct(
    id: number,
    modifications?: Partial<ProductFormData>
  ): Promise<ApiResponse<Product>> {
    return request<Product>(
      "post",
      `${PRODUCT_ENDPOINTS.get(id)}/duplicate`,
      modifications || {}
    );
  }

  /**
   * Get product statistics for dashboard
   */
  async getProductStats(): Promise<
    ApiResponse<{
      total: number;
      active: number;
      inactive: number;
      by_category: Record<number, number>;
    }>
  > {
    return request("get", `${PRODUCT_ENDPOINTS.list}/stats`);
  }

  /**
   * Export products data
   */
  async exportProducts(
    filters?: ProductFilters
  ): Promise<ApiResponse<{ download_url: string }>> {
    return request("post", `${PRODUCT_ENDPOINTS.list}/export`, filters || {});
  }

  /**
   * Import products from file
   */
  async importProducts(file: File): Promise<
    ApiResponse<{
      imported: number;
      failed: number;
      errors?: Array<{ row: number; message: string }>;
    }>
  > {
    const options: FormDataOptions = {
      fileFields: {
        import_file: {
          maxSize: 10 * 1024 * 1024, // 10MB
          allowedTypes: [
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ],
        },
      },
      validateFiles: true,
    };

    return request(
      "post",
      `${PRODUCT_ENDPOINTS.list}/import`,
      { import_file: file },
      { formDataOptions: options }
    );
  }

  /**
   * Reorder products by display_order
   */
  async reorderProducts(productIds: number[]): Promise<ApiResponse<void>> {
    return request("patch", `${PRODUCT_ENDPOINTS.list}/reorder`, {
      product_ids: productIds,
    });
  }
}

/**
 * Singleton instance of the ProductApiService
 */
export const productApi = new ProductApiService();
