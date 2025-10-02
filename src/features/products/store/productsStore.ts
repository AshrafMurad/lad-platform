import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { productApi } from "../services/productApi";
import {
  Product,
  ProductFormData,
  ProductFilters,
  ProductMedia,
} from "../types";

interface ProductsState {
  // Data state
  products: Product[];
  selectedProduct: Product | null;
  filters: ProductFilters;

  // UI state
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;

  // Pagination state
  currentPage: number;
  totalPages: number;
  totalProducts: number;

  // Actions
  fetchProducts: () => Promise<void>;
  getProduct: (id: number) => Promise<void>;
  createProduct: (data: ProductFormData) => Promise<Product | null>;
  updateProduct: (id: number, data: ProductFormData) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  uploadProductFiles: (
    id: number,
    files: { product_images?: File[]; product_documents?: File[] }
  ) => Promise<ProductMedia[] | null>;
  deleteProductMedia: (productId: number, mediaId: number) => Promise<boolean>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  setSelectedProduct: (product: Product | null) => void;
  setPage: (page: number) => void;
  clearError: () => void;
  reset: () => void;
}

const initialFilters: ProductFilters = {
  search: "",
  category_id: undefined,
  sub_category_id: undefined,
  micro_category_id: undefined,
  label: undefined,
  is_active: undefined,
  page: 1,
  per_page: 12,
};

const initialState = {
  products: [],
  selectedProduct: null,
  filters: initialFilters,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalProducts: 0,
};

export const useProductsStore = create<ProductsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchProducts: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await productApi.getMyProducts(get().filters);

          if (response.success && (response.data || response.response)) {
            const products = response.data || response.response || [];

            set({
              products: products,
              totalProducts: response.meta?.total || products.length,
              totalPages: response.meta?.last_page || 1,
              currentPage: response.meta?.current_page || 1,
              isLoading: false,
            });
          } else {
            set({
              error: response.message || "فشل في تحميل المنتجات",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "حدث خطأ أثناء تحميل المنتجات",
            isLoading: false,
          });
        }
      },

      getProduct: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          console.log(`🔍 [STORE] Fetching single product with ID: ${id}`);
          const response = await productApi.getProduct(id);

          console.log(`🔍 [STORE] Single product API response:`, {
            success: response.success,
            data: response.data,
            response: response.response,
            message: response.message,
            meta: response.meta,
          });

          if (response.success && (response.data || response.response)) {
            const product = response.data || response.response;
            console.log(`🔍 [STORE] Processed single product data:`, product);

            if (product) {
              console.log(`🔍 [STORE] Product field analysis:`, {
                id: product.id,
                name: product.name,
                name_ar: product.name_ar,
                name_en: product.name_en,
                description: product.description,
                description_ar: product.description_ar,
                description_en: product.description_en,
                price: product.price,
                price_type: typeof product.price,
                discount_type: product.discount_type,
                discount_value: product.discount_value,
                price_after_discount: product.price_after_discount,
                final_price: product.final_price,
                images: product.images,
                product_images: product.product_images,
                documents: product.documents,
                product_documents: product.product_documents,
                main_category: product.main_category,
                sub_category: product.sub_category,
                is_active: product.is_active,
                label: product.label,
              });
            }

            set({
              selectedProduct: product,
              isLoading: false,
            });
          } else {
            console.warn(
              `⚠️ [STORE] Single product API failed:`,
              response.message
            );
            set({
              error: response.message || "فشل في تحميل بيانات المنتج",
              isLoading: false,
            });
          }
        } catch (error) {
          console.error(`🚨 [STORE] Single product fetch error:`, error);
          set({
            error: "حدث خطأ أثناء تحميل المنتج",
            isLoading: false,
          });
        }
      },

      createProduct: async (data: ProductFormData) => {
        set({ isCreating: true, error: null });

        // Optimistic update - add temporary product
        const tempProduct: Product = {
          id: Date.now(), // Temporary ID
          name: data.name_ar || data.name_en, // Use primary name
          name_ar: data.name_ar,
          name_en: data.name_en,
          description: data.description_ar || data.description_en,
          description_ar: data.description_ar || "",
          description_en: data.description_en || "",
          main_category_id: data.main_category_id,
          sub_category_id: data.sub_category_id,
          micro_category_id: data.micro_category_id,
          price: Number(data.price),
          discount_type: data.discount_type,
          discount_value: Number(data.discount_value) || 0,
          final_price: Number(data.price), // Will be calculated by server
          label: data.label,
          is_active: data.is_active,
          display_order: data.display_order,
          images: [],
          documents: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_optimistic: true,
        };

        const currentProducts = get().products;
        set({
          products: [tempProduct, ...currentProducts],
          totalProducts: get().totalProducts + 1,
        });

        try {
          const response = await productApi.createProduct(data);

          if (response.success && (response.data || response.response)) {
            const createdProduct = response.data || response.response;
            if (createdProduct) {
              // Replace temporary product with real one
              set({
                products: [createdProduct, ...currentProducts],
                isCreating: false,
              });

              return createdProduct;
            }
          } else {
            // Rollback optimistic update
            set({
              products: currentProducts,
              totalProducts: get().totalProducts - 1,
              error: response.message || "فشل في إنشاء المنتج",
              isCreating: false,
            });

            return null;
          }
        } catch (error) {
          // Rollback optimistic update
          set({
            products: currentProducts,
            totalProducts: get().totalProducts - 1,
            error: "حدث خطأ أثناء إنشاء المنتج",
            isCreating: false,
          });

          return null;
        }
      },

      updateProduct: async (id: number, data: ProductFormData) => {
        set({ isUpdating: true, error: null });

        // Optimistic update - update product in list
        const currentProducts = get().products;
        const productIndex = currentProducts.findIndex((p) => p.id === id);

        if (productIndex === -1) {
          set({
            error: "المنتج غير موجود",
            isUpdating: false,
          });
          return null;
        }

        const updatedProduct = {
          ...currentProducts[productIndex],
          name_ar: data.name_ar,
          name_en: data.name_en,
          description_ar:
            data.description_ar || currentProducts[productIndex].description_ar,
          description_en:
            data.description_en || currentProducts[productIndex].description_en,
          main_category_id: data.main_category_id,
          sub_category_id:
            data.sub_category_id ||
            currentProducts[productIndex].sub_category_id,
          micro_category_id:
            data.micro_category_id ||
            currentProducts[productIndex].micro_category_id,
          price: Number(data.price),
          discount_type: data.discount_type,
          discount_value:
            Number(data.discount_value) ||
            currentProducts[productIndex].discount_value,
          final_price: Number(data.price), // Will be recalculated by server
          label: data.label,
          is_active: data.is_active,
          display_order:
            data.display_order || currentProducts[productIndex].display_order,
          updated_at: new Date().toISOString(),
          is_optimistic: true,
        };

        const optimisticProducts = [...currentProducts];
        optimisticProducts[productIndex] = updatedProduct;

        set({ products: optimisticProducts });

        try {
          const response = await productApi.updateProduct(id, data);

          if (response.success && (response.data || response.response)) {
            const updatedProduct = response.data || response.response;
            if (updatedProduct) {
              // Replace with server response
              const finalProducts = [...currentProducts];
              finalProducts[productIndex] = updatedProduct;

              set({
                products: finalProducts,
                selectedProduct:
                  get().selectedProduct?.id === id
                    ? updatedProduct
                    : get().selectedProduct,
                isUpdating: false,
              });

              return updatedProduct;
            }
          } else {
            // Rollback optimistic update
            set({
              products: currentProducts,
              error: response.message || "فشل في تحديث المنتج",
              isUpdating: false,
            });

            return null;
          }
        } catch (error) {
          // Rollback optimistic update
          set({
            products: currentProducts,
            error: "حدث خطأ أثناء تحديث المنتج",
            isUpdating: false,
          });

          return null;
        }
      },

      deleteProduct: async (id: number) => {
        set({ isDeleting: true, error: null });

        try {
          const response = await productApi.deleteProduct(id);

          if (response.success) {
            // Only update state after successful API response
            const currentProducts = get().products;
            const filteredProducts = currentProducts.filter((p) => p.id !== id);

            set({
              products: filteredProducts,
              totalProducts: get().totalProducts - 1,
              selectedProduct:
                get().selectedProduct?.id === id ? null : get().selectedProduct,
              isDeleting: false,
            });

            return true;
          } else {
            set({
              error: response.message || "فشل في حذف المنتج",
              isDeleting: false,
            });

            return false;
          }
        } catch (error) {
          set({
            error: "حدث خطأ أثناء حذف المنتج",
            isDeleting: false,
          });

          return false;
        }
      },

      setFilters: (newFilters: Partial<ProductFilters>) => {
        set({
          filters: { ...get().filters, ...newFilters, page: 1 },
          currentPage: 1,
        });

        // Auto-fetch with new filters
        get().fetchProducts();
      },

      clearFilters: () => {
        set({
          filters: initialFilters,
          currentPage: 1,
        });

        // Auto-fetch with cleared filters
        get().fetchProducts();
      },

      setSelectedProduct: (product: Product | null) => {
        set({ selectedProduct: product });
      },

      setPage: (page: number) => {
        set({
          filters: { ...get().filters, page },
          currentPage: page,
        });

        // Auto-fetch new page
        get().fetchProducts();
      },

      uploadProductFiles: async (
        id: number,
        files: { product_images?: File[]; product_documents?: File[] }
      ): Promise<ProductMedia[] | null> => {
        try {
          const response = await productApi.uploadProductFiles(id, files);

          if (response.success && (response.data || response.response)) {
            const uploadedFiles = response.data || response.response || [];

            // Update the selected product with new files if it's the same product
            const currentProduct = get().selectedProduct;
            if (currentProduct && Number(currentProduct.id) === id) {
              const updatedImages = [...(currentProduct.images || [])];
              const updatedDocuments = [...(currentProduct.documents || [])];

              uploadedFiles.forEach((file: ProductMedia) => {
                if (file.type === "image") {
                  updatedImages.push(file);
                } else if (file.type === "document") {
                  updatedDocuments.push(file);
                }
              });

              set({
                selectedProduct: {
                  ...currentProduct,
                  images: updatedImages,
                  documents: updatedDocuments,
                },
              });
            }

            return uploadedFiles;
          }

          return null;
        } catch (error) {
          console.error("Upload files error:", error);
          return null;
        }
      },

      deleteProductMedia: async (
        productId: number,
        mediaId: number
      ): Promise<boolean> => {
        try {
          const response = await productApi.deleteProductMedia(
            productId,
            mediaId
          );

          if (response.success) {
            // Update the selected product by removing the deleted file
            const currentProduct = get().selectedProduct;
            if (currentProduct && Number(currentProduct.id) === productId) {
              const updatedImages =
                currentProduct.images?.filter((img) => img.id !== mediaId) ||
                [];
              const updatedDocuments =
                currentProduct.documents?.filter((doc) => doc.id !== mediaId) ||
                [];

              set({
                selectedProduct: {
                  ...currentProduct,
                  images: updatedImages,
                  documents: updatedDocuments,
                },
              });
            }

            return true;
          }

          return false;
        } catch (error) {
          console.error("Delete media error:", error);
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "products-store",
      partialize: (state: ProductsState) => ({
        filters: state.filters,
        currentPage: state.currentPage,
      }),
    }
  )
);
